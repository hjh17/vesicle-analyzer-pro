from setuptools import setup, find_packages

setup(
    name='radius_finder',
    version='1.0.0',
    description='Analyzes circles on pack of .tif images',
    author='Hjortur Hjartarson',
    packages=find_packages(), install_requires=['zerorpc==0.6.1', 'opencv-python-headless==3.4.2.17', 'numpy', 'gevent==1.2.2']
)
