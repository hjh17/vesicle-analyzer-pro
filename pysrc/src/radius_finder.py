import cv2
import numpy as np
import json
import base64
import glob
import os



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
        self.cache[img_path].update({'original':ans, 'original_img':self.original})
        return json.dumps(ans)

    def process_image(self, img_path):
        if img_path in self.cache:
            if 'processed' in self.cache[img_path]:
                return json.dumps(self.cache[img_path]['processed'])
        else:
            self.cache[img_path] = dict()

        self.processed_img = self._preprocess_image(img_path)
        ans = dict(img_data=self.img_to_base64(self.processed_img))
        self.cache[img_path].update({'processed': ans, 'processed_img':self.processed_img})
        return json.dumps(ans)

    def detect_circles(self, img_path, binary_threshold=(25, 100), gaussian_kernel_size=5, gaussian_blur=0, dp=2.4,
                     minDist=40,
                     minRadius=10, maxRadius=80):

      if img_path in self.cache:
          if 'circles' in self.cache[img_path]:

              return json.dumps(self.cache[img_path]['circles'])
      else:
          self.cache[img_path] = dict()

      self.circles = cv2.HoughCircles(self.cache[img_path]['processed_img'], cv2.HOUGH_GRADIENT, dp=dp, minDist=minDist,
                                      minRadius=minRadius,
                                      maxRadius=maxRadius)


      if self.circles is None:
          img_data = dict(detected_circles=self.img_to_base64(self.cache[img_path]['original_img']))
          ans = dict(diameters=[], total=0, img_data=img_data)
          self.cache[img_path].update({'circles': ans})
          return json.dumps(ans)
      diameters = self.circles[0, :, 2] * 2
      circle_img = self.imshow(self.cache[img_path]['original_img'])
      img_data = dict(detected_circles=self.img_to_base64(circle_img))
      ans = dict(diameters=diameters.tolist(), total=len(diameters), img_data=img_data)
      self.cache[img_path].update({'circles': ans})
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

    def _preprocess_image(self, img_path,  binary_threshold=(25, 100), gaussian_kernel_size=5, gaussian_blur=0):
      img = cv2.imread(img_path)

      # Binarize given threshold values
      ret, processed_img = cv2.threshold(img, binary_threshold[0], binary_threshold[1], cv2.THRESH_BINARY)

      # Smooth edges with Gaussian blur
      processed_img = cv2.GaussianBlur(processed_img, (gaussian_kernel_size, gaussian_kernel_size), gaussian_blur)

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
        #show the output image
        # cv2.imshow("output", np.hstack([self.original, self.img]))
        # cv2.waitKey(0)

    def img_to_base64(self, img):
      retval, buffer = cv2.imencode('.jpg', img)
      jpg_as_text = base64.b64encode(buffer)

      return jpg_as_text.decode()

    def run_analyzes(self, path):
        files = glob.glob(path +'/*.tif')
        for file in files:
            self.get_original(file)
            self.process_image(file)
            self.detect_circles(file)
            self.get_original(file)

            self.process_image(file)

            self.detect_circles(file)
            print(self.cache[file]['circles'])

            break

if __name__ == '__main__':
  rf = RadiusFinder()
  rf.run_analyzes("/home/hjortur/workspace/vesicle_analyzer/tiff")
  # asdf = rf.find_circles('/home/hjortur/workspace/vesicle_analyzer/tiff/200xg_Mark_and_Find_Position008_t17_ch04.tif')
  #print(type(asdf))

  # print(asdf)
