import weaviate

client = weaviate.Client("http://localhost:8080")

product_schema = {
    "classes": [
        {
            "class": "Product",
            "description": "A class to represent products",
            "properties": [
                {
                    "name": "name",
                    "dataType": ["text"]
                },
                {
                    "name": "description",
                    "dataType": ["text"]
                },
                {
                    "name": "image_name",
                    "dataType": ["text"]
                }
            ]
        }
    ]
}

client.schema.create(product_schema)
