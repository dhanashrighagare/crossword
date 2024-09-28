"use client";

import { Box, Flex, Button, Heading, Image, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import { DeleteIcon } from '@chakra-ui/icons'
import useWishlist from "@/providers/WishlistState";
import useCart from "@/providers/CartState";

export default function Wishlist( ) {
  const { wishlist, removeProductInWishlist } = useWishlist();
  const { data } = useSession();
  const { cart, addProduct } = useCart();

  const removeFromWishlist = (productId) => {
    removeProductInWishlist(productId);
  }

  const handleRemoveFromWishlist = (productId) => {
    fetch("http://localhost:8000/api/users/removedfromwishlist", {
      method: "DELETE",
      body: JSON.stringify({
        userId: data?.user?.userId,
        productId: productId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setWishlist(data.wishlists);
      })
      .catch((error) => console.error(error));
  };

  // const handleAddToBag = async () => {
  //   addProduct({ _id: id, image, quantity: 1, name, author, price, discount });
  // }

  return (
    <Box p={20} overflowY="scroll" maxH="630px" >
      <Heading mb={6} fontSize={25} color="#444444" textAlign="center">
        My Wishlist
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 5}} spacing={6}>
      {wishlist &&
        wishlist?.map((item) => (
            <Stack key={item.id} align="center">
              <Image
                
                objectFit="cover"
                src={item.image}
                alt={item.name}
              />
              <Text mt={2} fontWeight="bold">{item.name}</Text>
              <Text color="#1f4f95">{item.author}</Text>
              <Text color="black.600" fontSize="md">₹ {item.price}</Text>

              <Flex alignItems="center" mt={2}>
                <Button
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="#000000"
                  border="1px solid black"
                  fontSize={14}
                  onClick={() => handleAddToBag()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'black';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#000000';
                  }}
                >
                  ADD TO BAG
                </Button>
                <DeleteIcon 
                  ml={3}
                  cursor="pointer"
                  onClick={() => removeFromWishlist(item.id)}  />
              </Flex>
            </Stack>
          )
        )}
      </SimpleGrid>
    </Box>
  );
}
