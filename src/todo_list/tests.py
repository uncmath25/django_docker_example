from django.test import TestCase

from .models import Item


class ItemTests(TestCase):

    def create_item(self, item_description):
        """
        Create an item in the temporary database with the given description
        """
        item = Item(descr=item_description)
        item.save()

    def test_that_items_can_be_created(self):
        """
        Check if any items exists
        """
        self.create_item('Blah')
        items = Item.objects.all()
        self.assertIs(len(items) > 0, True)
