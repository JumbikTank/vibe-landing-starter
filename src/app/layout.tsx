import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Vibe Landing Starter",
	description: "Соберите продуктовую страницу за вечер",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body className="antialiased">{children}</body>
		</html>
	);
}
