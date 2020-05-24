import lmdb
from argparse import ArgumentParser

parser = ArgumentParser(description='Extract files from a LMDB database')

parser.add_argument('-k', '--key', type=str, required=True,
                    help="Key for the file to extract")
parser.add_argument('-o', '--out', type=str, required=True,
                    help="Output path for file")

parser.add_argument(dest="lmdb_file", action="store", 
                  help="Target LMDB database" )

options = parser.parse_args()

lmdb_file = options.lmdb_file

lmdb_env = lmdb.open(lmdb_file, subdir=False, readonly=True)
lmdb_txn = lmdb_env.begin()
lmdb_cursor = lmdb_txn.cursor()

found_it = False
for key, value in lmdb_cursor:

	if key == options.key:
		print "Extracting image: %s to %s" % (key, options.out)
		with open(options.out, 'w') as of:
			of.write(value)
			found_it = True
		break

if not found_it:
	raise "Could not find key in database"


