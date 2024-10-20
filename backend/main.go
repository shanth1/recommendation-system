package main

import (
	"log"

	"github.com/go-resty/resty/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	app := fiber.New()

	app.Use(logger.New())

	client := resty.New()

	app.Get("/random-product", func(c *fiber.Ctx) error {
		var result map[string]interface{}

		resp, err := client.R().
			SetResult(&result). // Передаём указатель на переменную
			Get("http://localhost:8000/product/random")

		if err != nil {
			log.Println("Ошибка при запросе к микросервису:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Не удалось получить данные от микросервиса",
			})
		}

		if resp.StatusCode() != 200 {
			log.Println("Микросервис вернул ошибку:", resp.Status())
			return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
				"error": "Микросервис вернул ошибку",
			})
		}

		return c.JSON(result)
	})

	app.Post("/update-vector", func(c *fiber.Ctx) error {
		type RequestBody struct {
			UserVector []float64 `json:"user_vector"`
			ProductID  string    `json:"product_id"`
			Rating     int       `json:"rating"`
		}

		var body RequestBody
		if err := c.BodyParser(&body); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Неверный формат запроса",
			})
		}

		payload := map[string]interface{}{
			"user_vector": body.UserVector,
			"product_id":  body.ProductID,
			"feedback":    body.Rating,
		}

		var result map[string]interface{}

		resp, err := client.R().
			SetBody(payload).
			SetResult(&result). // Передаём указатель на переменную
			Post("http://127.0.0.1:8000/update_vector")

		if err != nil {
			log.Println("Ошибка при запросе к микросервису:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Не удалось обновить пользовательский вектор",
			})
		}

		if resp.StatusCode() != 200 {
			log.Println("Микросервис вернул ошибку:", resp.Status())

			return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
				"error": "Микросервис вернул ошибку",
			})
		}

		return c.JSON(result)
	})

	log.Println("Сервер запущен на порту 3000")
	if err := app.Listen(":3000"); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}
}
