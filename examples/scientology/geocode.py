import json
import random
from time import sleep

from geopy import geocoders
from geopy.exc import GeocoderServiceError


# Initialize the Geocoder that will translate addresses into coordinates
geocoder = geocoders.GoogleV3()

# Load the data from the JSON file and decode it into a list of businesses
filename = 'scientology-wise-members-2006.json'
data = json.load(open(filename))


try:

    # Go through the businesses one by one
    for i, business in enumerate(data):

        # Check if this business already has a geocoded coordinate from an earlier
        # script run. If so continue with the next business.
        if business.has_key('coordinate'):
            continue

        if not business.has_key('country'):
            print business

        address = u'{city}, {country}'.format(**business)
        try:
            location = geocoder.geocode(address, exactly_one=True)
            if location is not None:
                business['coordinate'] = {'latitude': location.latitude, 'longitude': location.longitude}
            else:
                print '---'
                print 'No location found for:', business
                print 'Address string was:   ', address
                print '---'

        except GeocoderServiceError:
            json.dump(data, open(filename, 'w'), indent=2)
            print "Failed after {0} entries.".format(i+1)
            raise

        # Pause the script execution for 0.1s in order to prevent being blocked
        # by Google.
        sleep(0.1)

finally:
    # Save the augmented data.
    json.dump(data, open(filename, 'w'), indent=2)
