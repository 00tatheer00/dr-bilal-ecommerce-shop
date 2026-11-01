import os
from PIL import Image
import numpy as np

src_path = r"C:/Users/hp/.gemini/antigravity/brain/e340d3ba-2f55-4788-88a8-3a65f9ff0ab8/.user_uploaded/media_1793550579660_6acb8c98.jpg"
out_dir = r"T:/Dr Bilal Ecommerce Store/gulnaar-by-mk/public/images"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path).convert("RGBA")
arr = np.array(img).astype(float)
r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
H, W = r.shape

# Estimated background gradient
y_coords = np.linspace(0, 1, H)[:, None]
bg_r = 58 * (1 - y_coords) + 34 * y_coords
bg_g = 2 * (1 - y_coords) + 3.5 * y_coords
bg_b = 16 * (1 - y_coords) + 11.5 * y_coords

diff_r = r - bg_r
diff_g = g - bg_g
diff_b = b - bg_b

dist = np.sqrt(diff_r**2 + (diff_g * 2.8)**2 + (diff_b * 1.5)**2)
green_boost = np.maximum(0, g - 12) * 3.2
flower_boost = np.maximum(0, r - (bg_r + 20)) * 2.2

fg_score = dist + green_boost + flower_boost

min_thresh = 18.0
max_thresh = 44.0
alpha = np.clip((fg_score - min_thresh) / (max_thresh - min_thresh), 0.0, 1.0)

# Remove the tiny 4-pointed star inside the upper curve of the 'G'
y_indices, x_indices = np.ogrid[:H, :W]
star_mask = ((x_indices - 661)**2 + (y_indices - 273)**2) < 24**2
alpha[star_mask] = 0.0

# Mathematical Unmult (removes dark burgundy fringe from edges)
alpha_safe = np.maximum(alpha, 0.001)
r_fg = np.clip((r - (1 - alpha) * bg_r) / alpha_safe, 0, 255)
g_fg = np.clip((g - (1 - alpha) * bg_g) / alpha_safe, 0, 255)
b_fg = np.clip((b - (1 - alpha) * bg_b) / alpha_safe, 0, 255)

out_arr = np.zeros((H, W, 4), dtype=np.uint8)
out_arr[:, :, 0] = r_fg.astype(np.uint8)
out_arr[:, :, 1] = g_fg.astype(np.uint8)
out_arr[:, :, 2] = b_fg.astype(np.uint8)
out_arr[:, :, 3] = (alpha * 255).astype(np.uint8)

full_img = Image.fromarray(out_arr, "RGBA")

# 1. Bounding box crop for Full Logo
alpha_mask = out_arr[:, :, 3] > 25
y_nz, x_nz = np.where(alpha_mask)
pad = 16
y_min, y_max = max(0, y_nz.min() - pad), min(H, y_nz.max() + pad)
x_min, x_max = max(0, x_nz.min() - pad), min(W, x_nz.max() + pad)

cropped_full = full_img.crop((x_min, y_min, x_max, y_max))
cropped_full.save(os.path.join(out_dir, "logo.png"), "PNG")
print("Saved tight logo.png:", cropped_full.size)

# 2. Monogram Icon (The 'G' with the Red Flower)
# G monogram bounds: roughly Y=89..510, X=220..710
mono_y_min = max(0, y_nz.min() - 8)
mono_y_max = 505
mono_x_min = 220
mono_x_max = 715

cropped_icon = full_img.crop((mono_x_min, mono_y_min, mono_x_max, mono_y_max))
# Make it square with padding
max_dim = max(cropped_icon.size) + 20
square_icon = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
paste_x = (max_dim - cropped_icon.width) // 2
paste_y = (max_dim - cropped_icon.height) // 2
square_icon.paste(cropped_icon, (paste_x, paste_y), cropped_icon)
square_icon.save(os.path.join(out_dir, "logo-icon.png"), "PNG")
print("Saved logo-icon.png:", square_icon.size)

# 3. Horizontal Navbar Logo (Monogram on left, Typography on right)
# Typography part: Y=530..846, X=x_min..x_max
typo_crop = full_img.crop((x_min, 530, x_max, y_max))

# Scale icon to match typography height
target_h = typo_crop.height
icon_ratio = cropped_icon.width / cropped_icon.height
new_icon_w = int(target_h * icon_ratio)
resized_icon = cropped_icon.resize((new_icon_w, target_h), Image.Resampling.LANCZOS)

spacing = 40
nav_w = resized_icon.width + spacing + typo_crop.width
nav_img = Image.new("RGBA", (nav_w, target_h), (0, 0, 0, 0))
nav_img.paste(resized_icon, (0, 0), resized_icon)
nav_img.paste(typo_crop, (resized_icon.width + spacing, 0), typo_crop)
nav_img.save(os.path.join(out_dir, "logo-horizontal.png"), "PNG")
print("Saved logo-horizontal.png:", nav_img.size)
