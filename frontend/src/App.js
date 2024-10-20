import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Container,
	Typography,
	IconButton,
	Box,
	useTheme,
	useMediaQuery,
	Paper,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RefreshIcon from "@mui/icons-material/Refresh";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const defaultUserVector = [
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
	0.0, 0.0,
];

const App = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Определяем устройство

	const [product, setProduct] = useState(null);
	const [count, setCount] = useState(0);
	const userVector =
		JSON.parse(localStorage.getItem("userVector")) || defaultUserVector;

	const fetchImage = async (imageName) => {
		try {
			const response = await fetch(
				`http://localhost:4000/image?name=${imageName}`,
			);
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			document.getElementById("myImage").src = url;
		} catch (error) {
			console.error("Error fetching the image:", error);
		}
	};

	const fetchProduct = async () => {
		try {
			const response = await axios.get(
				"http://localhost:4000/random-product",
			);
			await fetchImage(response.data.product.image_name);
			setProduct(response.data.product);
		} catch (error) {
			console.error("Ошибка при получении продукта:", error);
		}
	};

	const updateFeedback = async (feedback) => {
		try {
			const response = await axios.post(
				"http://localhost:4000/update-vector",
				{
					user_vector: userVector,
					product_id: product?.id,
					feedback: feedback,
				},
			);
			localStorage.setItem(
				"userVector",
				JSON.stringify(response.data.user_vector),
			);
			setProduct(response.data.product);
		} catch (error) {
			console.error("Ошибка при отправке отзыва:", error);
		}
	};

	const resetLocalStorage = () => {
		localStorage.setItem("userVector", JSON.stringify(defaultUserVector));
		fetchProduct();
	};

	useEffect(() => {
		fetchProduct();
	}, []);

	console.log(product);
	return (
		<Container
			maxWidth="sm"
			style={{
				maxHeight: "100vh",
				height: "100vh",
				overflow: "hidden",
				padding: "20px 0",
			}}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={2}
			>
				<IconButton
					onClick={resetLocalStorage}
					style={{ backgroundColor: "#FFFFFF" }}
				>
					<RefreshIcon />
				</IconButton>
				<Box
					display="flex"
					alignItems="center"
					position="relative"
					style={{ padding: "20px" }}
				>
					<ShoppingCartIcon />
					<Box
						sx={{
							position: "absolute",
							top: 5,
							right: 10,
							backgroundColor: "#404040",
							borderRadius: "50%",
							width: "18px",
							height: "18px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "12px",
							color: "white",
						}}
					>
						{count}
					</Box>
				</Box>
			</Box>

			{product ? (
				<Box textAlign="center" flexGrow={1} overflow="hidden">
					<Typography variant="h5" gutterBottom>
						{product.name}
					</Typography>
					<Paper
						elevation={3}
						style={{
							padding: "10px",
							borderRadius: "15px",
							marginBottom: "20px",
						}}
					>
						<img
							id="myImage"
							alt={product.name}
							style={{
								maxWidth: "100%",
								height: "auto",
								borderRadius: "15px",
							}}
						/>
					</Paper>

					<Box
						style={{
							padding: "15px",
							borderRadius: "15px",
							boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.2)",
							marginBottom: "20px",
							maxHeight: "100px",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						<Typography variant="body2">
							{product.description}
						</Typography>
					</Box>
				</Box>
			) : (
				<Box textAlign="center">
					<Typography>No products ): </Typography>
				</Box>
			)}

			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				position="absolute"
				bottom="20px"
				left="0"
				right="0"
				px={5}
			>
				<IconButton
					onClick={() => updateFeedback(-1)}
					style={{
						backgroundColor: "#FFCCCC",
						width: "100px",
						height: "100px",
					}}
				>
					<ThumbDownIcon />
				</IconButton>
				<IconButton
					onClick={() => setCount(count + 1)}
					style={{
						backgroundColor: "#404040",
						color: "white",
						width: "60px",
						height: "60px",
					}}
				>
					<ShoppingCartIcon />
				</IconButton>
				<IconButton
					onClick={() => updateFeedback(1)}
					style={{
						backgroundColor: "#CCFFCC",
						width: "100px",
						height: "100px",
					}}
				>
					<ThumbUpIcon />
				</IconButton>
			</Box>
		</Container>
	);
};

export default App;
