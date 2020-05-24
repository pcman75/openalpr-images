import lmdb
import re
from argparse import ArgumentParser

parser = ArgumentParser(description='Extract video from an openalpr LMDB database')

parser.add_argument('-e', '--epochtime', type=int, required=True,
                    help="epochtime for the file to extract")
parser.add_argument('-o', '--out', type=str, required=True,
                    help="Output path for file")

parser.add_argument(dest="lmdb_file", action="store", 
                  help="Target LMDB database" )

options = parser.parse_args()

""" class options:
	pass
options.lmdb_file = '/var/lib/openalpr/videoclips/image_db/1590058168149.mdb'
options.epochtime = 1590066989394
options.out = str(1590066989394) + '.mp4' """

lmdb_env = lmdb.open(options.lmdb_file, subdir=False, readonly=True)
lmdb_txn = lmdb_env.begin()
lmdb_cursor = lmdb_txn.cursor()

found_it = False
prev_key = ''
for key, value in lmdb_cursor:
	key_epoch = int(re.findall("([A-Z0-9]+)", key)[2])
	if key_epoch > options.epochtime:
		print "Extracting file to: %s to %s" % (key, options.out)
		with open(options.out, 'w') as of:
			of.write(value)
			found_it = True
		break
	prev_key = key

if not found_it:
	raise "Could not find key in database"


