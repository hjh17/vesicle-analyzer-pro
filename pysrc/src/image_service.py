import base64
import functools
import cv2
import numpy as np
import time

@functools.lru_cache(maxsize=256)
def get_image(img_path):
    return cv2.imread(img_path)

@functools.lru_cache(maxsize=256)
def img_to_base64(img):
    retval, buffer = cv2.imencode('.jpg', img)
    jpg_as_text = base64.b64encode(buffer)
    return jpg_as_text.decode()

@functools.lru_cache(maxsize=256)
def get_processed_image(img_path, binary_threshold=(25, 100), gaussian_kernel_size=5, gaussian_blur=0):
    img = cv2.imread(img_path)
    # Binarize given threshold values
    ret, processed_img = cv2.threshold(img, binary_threshold[0], binary_threshold[1], cv2.THRESH_BINARY)
    # Smooth edges with Gaussian blur
    processed_img = cv2.GaussianBlur(processed_img, (gaussian_kernel_size, gaussian_kernel_size), gaussian_blur)

    # Grayscale image
    processed_img = cv2.cvtColor(processed_img, cv2.COLOR_BGR2GRAY)

    return processed_img

@functools.lru_cache(maxsize=256)
def get_circled_image(img_path, binary_threshold=(25, 100), gaussian_kernel_size=5, gaussian_blur=0, dp=2.4,minDist=40,minRadius=10, maxRadius=80, radiusProportion=1):
    img = get_image(img_path)
    processed_img = get_processed_image(img_path, binary_threshold=binary_threshold, gaussian_kernel_size=5, gaussian_blur=gaussian_blur)
    circles = cv2.HoughCircles(processed_img, cv2.HOUGH_GRADIENT, dp=dp, minDist=minDist, minRadius=minRadius, maxRadius=maxRadius)
    if circles is None:
        circle_img = img
        diameters = []
    else:
        diameters = circles[0, :, 2] * 2
        diameters = diameters.tolist()
        circle_img = img.copy()
        circles = np.round(circles[0, :]).astype("int")

        # loop over the (x, y) coordinates and radius of the circles
        for idx, (x, y, r) in enumerate(circles):
            # draw the circle in the output image, then draw a rectangle
            # corresponding to the center of the circle
            cv2.circle(circle_img, (x, y), int(r*radiusProportion), (0, 255, 0), 4)
            cv2.rectangle(circle_img, (x - 5, y - 5), (x + 5, y + 5), (0, 128, 255), -1)
            cv2.putText(circle_img, str(idx), (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            cv2.putText(circle_img, 'radius ' + str(r), (int(x), int(y) + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                        (255, 255, 255), 2)
    return circle_img, diameters

if __name__ == '__main__':
    t1 = time.time()
    
    get_circled_image('/home/hjortur/workspace/vesicle_analyzer/hjohja.tif')
    print(time.time() - t1)
    t1 = time.time()
    
    get_circled_image('/home/hjortur/workspace/vesicle_analyzer/hjohja.tif')
    print(time.time() - t1)
