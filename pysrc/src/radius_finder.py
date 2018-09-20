import cv2
import numpy as np
import json
import base64
import zerorpc
import gevent
import image_service


class RadiusFinder(object):

    def __init__(self):
        self.cache = dict()

    def get_original(self, img_path):
        if img_path in self.cache:
            if 'original' in self.cache[img_path]:
                return json.dumps(self.cache[img_path]['original'])

        else:
            self.cache[img_path] = dict()

        self.original = cv2.imread(img_path)
        ans = dict(img_data=self.img_to_base64(self.original))
        self.cache[img_path].update({'original': ans, 'original_img': self.original})
        return json.dumps(ans)

    def get_processed_image(self, img_path, params):
        binary_threshold_min = params["minBinaryThreshold"]
        binary_threshold_max = params["maxBinaryThreshold"]
        gaussian_blur = params["gaussianBlur"]

        processed_img = image_service.get_processed_image(img_path,
                                                          binary_threshold=(binary_threshold_min, binary_threshold_max),
                                                          gaussian_blur=gaussian_blur)
        return dict(img_data=self.img_to_base64(processed_img))

    def get_detected_circles(self, img_path, params):
        binary_threshold_min = params["minBinaryThreshold"]
        binary_threshold_max = params["maxBinaryThreshold"]
        gaussian_blur = params["gaussianBlur"]
        dp = params["dp"]
        minDist = params["centerDistance"]
        minRadius = params["minRadius"]
        maxRadius = params["maxRadius"]
        radiusProportion = params["radiusProportion"]

        detected_circles, diameters = image_service.get_circled_image(img_path,
                                                                      (binary_threshold_min, binary_threshold_max), 5,
                                                                      gaussian_blur, dp,
                                                                      minDist,
                                                                      int(minRadius), int(maxRadius),
                                                                      radiusProportion)
        diameters = [d * radiusProportion for d in diameters]
        return dict(img_data=self.img_to_base64(detected_circles), diameters=diameters)

    def find_circles(self, img_path, binary_threshold=(25, 100), gaussian_kernel_size=5, gaussian_blur=0, dp=2.4,
                     minDist=40,
                     minRadius=10, maxRadius=80):
        self.img_path = img_path
        self.img = cv2.imread(img_path)
        self.original = self.img.copy()

        self.processed_img = self._preprocess_image(binary_threshold, gaussian_kernel_size, gaussian_blur)
        self.circles = cv2.HoughCircles(self.processed_img, cv2.HOUGH_GRADIENT, dp=dp, minDist=minDist,
                                        minRadius=minRadius,
                                        maxRadius=maxRadius)
        if self.circles is None:
            img_data = dict(detected_circles=self.img_to_base64(self.img), original=self.img_to_base64(self.original),
                            processed=self.img_to_base64(self.processed_img))
            ans = dict(diameters=[], total=0, img_data=img_data)
            return json.dumps(ans)
        diameters = self.circles[0, :, 2] * 2
        self.imshow()
        img_data = dict(detected_circles=self.img_to_base64(self.img), original=self.img_to_base64(self.original),
                        processed=self.img_to_base64(self.processed_img))
        ans = dict(diameters=diameters.tolist(), total=len(diameters), img_data=img_data)
        return json.dumps(ans)

    @zerorpc.stream
    def calculate_all(self, paths, params):
        return self._image_generator(paths, params)

    def _image_generator(self, paths, params):
        binary_threshold_min = params["minBinaryThreshold"]
        binary_threshold_max = params["maxBinaryThreshold"]
        gaussian_blur = params["gaussianBlur"]
        dp = params["dp"]
        minDist = params["centerDistance"]
        minRadius = params["minRadius"]
        maxRadius = params["maxRadius"]
        radiusProportion = params["radiusProportion"]

        for path in paths:
            img = cv2.imread(path)
            processed_img = self._preprocess_image(path, (binary_threshold_min, binary_threshold_max), gaussian_blur)
            ans = dict(img_data=self.img_to_base64(img), processed_img=self.img_to_base64(processed_img))

            self.circles = cv2.HoughCircles(processed_img, cv2.HOUGH_GRADIENT, dp=dp, minDist=minDist,
                                            minRadius=int(minRadius),
                                            maxRadius=int(maxRadius))

            if self.circles is None:
                circle_img = img
                diameters = []
            else:
                diameters = self.circles[0, :, 2] * 2
                diameters = diameters.tolist()
                diameters = [d * radiusProportion for d in diameters]
                circle_img = self.imshow(img)

            gevent.sleep(0.0001)
            ans = dict(img_data=self.img_to_base64(img), processed_img=self.img_to_base64(processed_img),
                       cirlces=self.img_to_base64(circle_img), diameters=diameters, path=path)
            yield ans

    def _preprocess_image(self, img_path, binary_threshold=(25, 100), gaussian_blur=0):
        img = cv2.imread(img_path)

        # Binarize given threshold values
        ret, processed_img = cv2.threshold(img, binary_threshold[0], binary_threshold[1], cv2.THRESH_BINARY)

        # Smooth edges with Gaussian blur
        processed_img = cv2.GaussianBlur(processed_img, (5, 5), gaussian_blur)

        # Grayscale image
        processed_img = cv2.cvtColor(processed_img, cv2.COLOR_BGR2GRAY)

        return processed_img

    def imshow(self, img):
        img_copy = img.copy()
        if self.circles is not None:
            # convert the (x, y) coordinates and radius of the circles to integers
            circles = np.round(self.circles[0, :]).astype("int")

            # loop over the (x, y) coordinates and radius of the circles
            for idx, (x, y, r) in enumerate(circles):
                # draw the circle in the output image, then draw a rectangle
                # corresponding to the center of the circle
                cv2.circle(img_copy, (x, y), r, (0, 255, 0), 4)
                cv2.rectangle(img_copy, (x - 5, y - 5), (x + 5, y + 5), (0, 128, 255), -1)
                cv2.putText(img_copy, str(idx), (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                cv2.putText(img_copy, 'radius ' + str(r), (int(x), int(y) + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                            (255, 255, 255), 2)
        return img_copy
        # show the output image
        # cv2.imshow("output", np.hstack([self.original, self.img]))
        # cv2.waitKey(0)

    def img_to_base64(self, img):
        retval, buffer = cv2.imencode('.jpg', img)
        jpg_as_text = base64.b64encode(buffer)
        return jpg_as_text.decode()