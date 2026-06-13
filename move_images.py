import os
import shutil
import glob

source_dir = r'C:\Users\ELITE BOOK\.gemini\antigravity\brain\f50bfe44-6eb9-4161-83dd-59a58e41649b'
target_dir = r'c:\Users\ELITE BOOK\Desktop\html\frontend-react\public\assets\images\destinations'

if not os.path.exists(target_dir):
    os.makedirs(target_dir)

mappings = {
    'hunza_valley': 'hunza.png',
    'skardu_landscape': 'skardu.png',
    'fairy_meadows_nanga_parbat': 'fairy_meadows.png',
    'swat_valley_river': 'swat.png',
    'naran_kaghan_lake': 'naran.png',
    'neelum_valley_kashmir': 'neelum.png',
    'chitral_kalash_valley': 'chitral.png',
    'murree_hills_landscape': 'murree.png',
    'kumrat_valley_forest': 'kumrat.png',
    'gilgit_mountain_city': 'gilgit.png',
    'kalam_valley_swat_landscape': 'kalam.png',
    'shogran_siri_paye': 'shogran.png',
    'serena_hotel_gilgit': 'serena_gilgit.png',
    'shangrila_resort_skardu': 'shangrila_resort.png',
    'fairy_meadows_huts_hotel': 'fairy_meadows_huts.png',
    'hunza_darbar_hotel_landscape': 'hunza_darbar.png',
    'swat_continental_hotel_swat': 'swat_continental.png'
}

files = glob.glob(os.path.join(source_dir, '*.png'))

for file_path in files:
    filename = os.path.basename(file_path)
    for prefix, new_name in mappings.items():
        if filename.startswith(prefix):
            shutil.copy2(file_path, os.path.join(target_dir, new_name))
            print(f"Copied {filename} to {new_name}")
            break
