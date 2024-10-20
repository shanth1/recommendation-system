# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import weaviate
import numpy as np

app = FastAPI()

client = weaviate.Client("http://localhost:8080")

class UserFeedback(BaseModel):
    user_vector: list
    product_id: str
    feedback: int  # 1 - лайк, -1 - дизлайк

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
    product = client.data_object.get_by_id(feedback.product_id, class_name="Product", with_vector=True)
    if not product:
        return

    product_vector = product["vector"]

    new_user_vector = update_user_vector(feedback.user_vector, product_vector, feedback.feedback)

    result = client.query.get("Product", ["name", "description"]).with_near_vector({"vector": new_user_vector}).with_limit(1).do()
    new_product = result["data"]["Get"]["Product"][0]

    return {
        "user_vector": new_user_vector,
        "product": new_product
    }
