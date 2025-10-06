interface CartItem {
  id: string // Changed from number to string for MongoDB _id
  name: string
  nameEn: string
  price: number
  image: string
  quantity: number
  specialInstructions?: string
}
