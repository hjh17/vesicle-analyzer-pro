import cv2
import numpy as np
import json
import base64


class RadiusFinder(object):

    def get_original(self, img_path):
        self.original = cv2.imread(img_path)
        ans = dict(img_data=self.img_to_base64(self.original))
        return json.dumps(ans)

    def process_image(self):
        self.img = self.original.copy()
        self.processed_img = self._preprocess_image()
        ans = dict(img_data=self.img_to_base64(self.processed_img))
        return json.dumps(ans)

    def detect_circles(self, binary_threshold=(25, 100), gaussian_kernel_size=5, gaussian_blur=0, dp=2.4,
                     minDist=40,
                     minRadius=10, maxRadius=80):
      self.circles = cv2.HoughCircles(self.processed_img, cv2.HOUGH_GRADIENT, dp=dp, minDist=minDist,
                                      minRadius=minRadius,
                                      maxRadius=maxRadius)
      diameters = self.circles[0, :, 2] * 2
      self.imshow()
      img_data = dict(detected_circles=self.img_to_base64(self.img), original=self.img_to_base64(self.original),
                      processed=self.img_to_base64(self.processed_img))
      ans = dict(diameters=diameters.tolist(), total=len(diameters), img_data=img_data)
      return json.dumps(ans)

    def find_circles(self, img_path, binary_threshold=(25, 100), gaussian_kernel_size=5, gaussian_blur=0, dp=2.4,
                     minDist=40,
                     minRadius=10, maxRadius=80):
      self.img_path = img_path
      print(img_path)
      self.img = cv2.imread(img_path)
      self.original = self.img.copy()

      self.processed_img = self._preprocess_image(binary_threshold, gaussian_kernel_size, gaussian_blur)
      self.circles = cv2.HoughCircles(self.processed_img, cv2.HOUGH_GRADIENT, dp=dp, minDist=minDist,
                                      minRadius=minRadius,
                                      maxRadius=maxRadius)
      diameters = self.circles[0, :, 2] * 2
      self.imshow()
      img_data = dict(detected_circles=self.img_to_base64(self.img), original=self.img_to_base64(self.original),
                      processed=self.img_to_base64(self.processed_img))
      ans = dict(diameters=diameters.tolist(), total=len(diameters), img_data=img_data)
      return json.dumps(ans)

    def _preprocess_image(self, binary_threshold=(25, 100), gaussian_kernel_size=5, gaussian_blur=0):
      # Binarize given threshold values
      ret, processed_img = cv2.threshold(self.img, binary_threshold[0], binary_threshold[1], cv2.THRESH_BINARY)

      # Smooth edges with Gaussian blur
      processed_img = cv2.GaussianBlur(processed_img, (gaussian_kernel_size, gaussian_kernel_size), gaussian_blur)

      # Grayscale image
      processed_img = cv2.cvtColor(processed_img, cv2.COLOR_BGR2GRAY)

      return processed_img

    def imshow(self):
      if self.circles is not None:
        # convert the (x, y) coordinates and radius of the circles to integers
        circles = np.round(self.circles[0, :]).astype("int")

        # loop over the (x, y) coordinates and radius of the circles
        for idx, (x, y, r) in enumerate(circles):
          # draw the circle in the output image, then draw a rectangle
          # corresponding to the center of the circle
          cv2.circle(self.img, (x, y), r, (0, 255, 0), 4)
          cv2.rectangle(self.img, (x - 5, y - 5), (x + 5, y + 5), (0, 128, 255), -1)
          cv2.putText(self.img, str(idx), (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
          cv2.putText(self.img, 'radius ' + str(r), (int(x), int(y) + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                      (255, 255, 255), 2)

        #show the output image
        # cv2.imshow("output", np.hstack([self.original, self.img]))
        # cv2.waitKey(0)

    def img_to_base64(self, img):
      retval, buffer = cv2.imencode('.jpg', img)
      jpg_as_text = base64.b64encode(buffer)

      return jpg_as_text.decode()

    def asdf(self, img_path):

      img = cv2.imread(img_path)
      retval, buffer = cv2.imencode('.jpg', img)
      jpg_as_text = base64.b64encode(buffer)

      ans = dict(img_data=jpg_as_text.decode())
      return json.dumps(ans)


if __name__ == '__main__':
  rf = RadiusFinder()
  asdf = rf.find_circles('/home/hjortur/workspace/vesicle_analyzer/test.tif')
  print(type(asdf))

  # print(asdf)
