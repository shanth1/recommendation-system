from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
import weaviate
from fastapi import FastAPI, HTTPException
import numpy as np
from vector import generate_default_user_vector, get_combined_vector
import random

app = FastAPI()

client = weaviate.Client("http://localhost:8080")

class UserFeedback(BaseModel):
    user_vector: list
    product_id: str
    feedback: int  # 1 - лайк, -1 - дизлайк

class Product(BaseModel):
    id: str
    name: str
    description: str
    image_name: str

class ProductInput(BaseModel):
    products: List[Product]

def add_products_to_weaviate(product_list: List[Product]):
    for product in product_list:
        print("add product", product)
        combined_vector = get_combined_vector(product.description, "../storage/"+product.image_name)
        data_object = {
            "name": product.name,
            "description": product.description,
            "image_name": product.image_name
        }
        client.data_object.create(
            data_object=data_object,
            class_name="Product",
            uuid=product.id,
            vector=combined_vector
        )


def update_user_vector(user_vector, product_vector, feedback):
    learning_rate = 0.1
    user_vector = np.array(user_vector)
    product_vector = np.array(product_vector)
    if feedback == 1:
        user_vector = user_vector + learning_rate * (product_vector - user_vector)
    else:
        user_vector = user_vector - learning_rate * (product_vector - user_vector)
    return user_vector.tolist()

@app.post("/update_vector")
def update_vector(feedback: UserFeedback):
    try:
        product = client.data_object.get_by_id(feedback.product_id, class_name="Product", with_vector=True)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Product with ID {feedback.product_id} not found.")

    if not product:
        raise HTTPException(status_code=404, detail=f"Product with ID {feedback.product_id} not found.")

    product_vector = product["vector"]

    new_user_vector = update_user_vector(feedback.user_vector, product_vector, feedback.feedback)

    result = client.query \
        .get("Product", ["name", "description", "_additional {id}"]) \
        .with_near_vector({"vector": new_user_vector}) \
        .with_limit(1) \
        .do()

    products = result.get("data", {}).get("Get", {}).get("Product", [])
    if not products:
        raise HTTPException(status_code=404, detail="No products found.")

    new_product = products[0]

    return {
        "user_vector": new_user_vector,
        "product": new_product
    }

@app.post("/generate_default_user_vector")
def get_default_user_vector():
    default_vector = generate_default_user_vector()
    return {"user_vector": default_vector}

@app.post("/add_products")
def add_products(productInput: ProductInput):
    try:
        add_products_to_weaviate(list(productInput.products))
        return {"status": "Products added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products")
def get_all_products():
    try:
        result = client.query.get("Product", ["_additional {id}", "name"]).do()
        products = result.get("data", {}).get("Get", {}).get("Product", [])

        formatted_products = [
	        {"id": prod["_additional"]["id"], "name": prod["name"]}
	        for prod in products
	    ]

        return {"products": formatted_products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/product/random")
def get_random_product():
    try:
        result = client.query.get("Product", ["_additional {id}", "name"]).do()
        products = result.get("data", {}).get("Get", {}).get("Product", [])

        formatted_products = [
	        {"id": prod["_additional"]["id"], "name": prod["name"]}
	        for prod in products
	    ]

        random_product = random.choice(formatted_products)
        return {"product": random_product}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
