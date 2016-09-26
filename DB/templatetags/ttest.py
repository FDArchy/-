from django.template import Library, Node
from django.core.paginator import Paginator

register = Library()


def show_objects(parser, token):
    format_string = token.split_contents()
    return PaginatorNode(format_string)


class PaginatorNode(Node):
    def __init__ (self, format_string):
        self.format_string = format_string

    def render(self, context):
        return '''<h1 style="color:#ff0000">TEST</h1>'''

register.tag('testshow', show_objects)
