import sys
from src.radius_finder import RadiusFinder
import zerorpc


class Server:
    def __init__(self):
        self.objects = []

    def register(self, obj):
        self.objects.append(obj)
        for method in dir(obj):
            if callable(getattr(obj, method)) and not method.startswith("__"):
                if dir(self).__contains__(method):
                    print("you have register method:" + method)
                    sys.exit(0)
                setattr(self, method, getattr(obj, method))


def main(port):
    addr = 'tcp://127.0.0.1:' + str(port)
    server = Server()
    server.register(RadiusFinder())
    s = zerorpc.Server(server)
    s.bind(addr)
    print("start running on {}. Python: {}".format(addr, sys.version))
    s.run()


if __name__ == "__main__":
    main(4242)
