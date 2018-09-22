import unittest
import numpy as np
from src import image_service
from src import ROOT_DIR
import os
import time


class TestImageService(unittest.TestCase):
    def setUp(self):
        self.test_image_path = os.path.join(ROOT_DIR, 'test_img.tif')
        print(self.test_image_path)


    def test_get_image(self):
        t1 = time.time()
        img = image_service.get_image(self.test_image_path)
        d1 = time.time() - t1
        t1 = time.time()
        img = image_service.get_image(self.test_image_path)
        d2 = time.time() - t1
        self.assertEqual(img.shape, (1024, 1024, 3))
        # Assert memoize
        self.assertTrue(d2 < d1)

    def test_img_to_base64(self):
        img = image_service.get_image(self.test_image_path)
        a = image_service.img_to_base64(img)
        self.assertTrue(isinstance(a, str))

    def test_get_processed_image(self):
        t1 = time.time()
        binary_threshold = (50, 100)
        img = image_service.get_processed_image(self.test_image_path, binary_threshold)
        d1 = time.time() - t1
        t1 = time.time()
        img = image_service.get_processed_image(self.test_image_path, binary_threshold)
        d2 = time.time() - t1

        self.assertFalse(np.any(img[:, :] > 51) and np.any(img[:, :] < 100))  # Assert binary threshold
        self.assertEqual(img.shape, (1024, 1024))  # Assert grayscale
        # Assert memoize
        self.assertTrue(d2 < d1)

    def test_get_circled_image(self):
        t1 = time.time()
        img, diameters = image_service.get_circled_image(self.test_image_path)
        d1 = time.time() - t1
        t1 = time.time()
        img, diameters = image_service.get_circled_image(self.test_image_path)
        d2 = time.time() - t1
        self.assertEqual(img.shape, (1024, 1024, 3))
        self.assertEqual(len(diameters), 89)
        # Assert memoize
        self.assertTrue(d2 < d1)

        img, diameters = image_service.get_circled_image(self.test_image_path, dp=0.001)
        org_image = image_service.get_image(self.test_image_path)
        self.assertEqual(len(diameters), 0)
        self.assertTrue(np.array_equal(img, org_image))


if __name__ == "__main__":
    unittest.main()
