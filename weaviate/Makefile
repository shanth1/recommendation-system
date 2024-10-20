products:
	curl -X GET http://localhost:8000/products

product:
	curl -X GET http://localhost:8000/product/random

add-products:
	curl -X POST "http://127.0.0.1:8000/add_products" -H "Content-Type: application/json" -d @products.json

feedback:
	curl -X POST "http://127.0.0.1:8000/update_vector" -H "Content-Type: application/json" -d @feedback.json
