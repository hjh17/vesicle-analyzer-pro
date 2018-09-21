import unittest
from src.radius_finder import RadiusFinder
from src import ROOT_DIR
import os


class TestRadiusFinder(unittest.TestCase):
    def setUp(self):
        self.radius_finder = RadiusFinder()
        self.test_image_path = os.path.join(ROOT_DIR, '../test_img.tif')
        self.params = {
            "minBinaryThreshold": 40,
            "maxBinaryThreshold": 100,
            "gaussianBlur": 0,
            "dp": 2.4,
            "centerDistance": 40,
            "minRadius": 10,
            "maxRadius": 80,
            "radiusProportion": 1
        }

    def test_get_original(self):
        response = self.radius_finder.get_original(self.test_image_path)
        self.assertIn('img_data', response)
        self.assertIsInstance(response['img_data'], str)

    def test_get_processed_image(self):
        response = self.radius_finder.get_processed_image(self.test_image_path, self.params)
        self.assertIn('img_data', response)
        self.assertIsInstance(response['img_data'], str)

    def test_get_detected_circles(self):
        response = self.radius_finder.get_detected_circles(self.test_image_path, self.params)
        self.assertIn('img_data', response)
        self.assertIn('diameters', response)
        self.assertIsInstance(response['img_data'], str)
        self.assertIsInstance(response['diameters'], list)
        self.assertEqual(len(response['diameters']), 83)


if __name__ == "__main__":
    unittest.main()
