import torch
import clip
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

def get_combined_vector(text: str, image_path: str):
    image_input = preprocess(Image.open(image_path)).unsqueeze(0).to(device)
    text_input = clip.tokenize([text]).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image_input)
        text_features = model.encode_text(text_input)

    image_vector = image_features.cpu().numpy()
    text_vector = text_features.cpu().numpy()

    combined_vector = (text_vector + image_vector) / 2

    combined_vector_flatten = combined_vector.flatten()

    return combined_vector

print("VECTOR:", get_combined_vector("cats", "cats.jpg"))
