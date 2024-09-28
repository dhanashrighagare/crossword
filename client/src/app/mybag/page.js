"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Table,
  TableContainer,
  Tbody,
  Th,
  Tr,
  Td,
  Thead,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import useCart from "@/providers/CartState";
import { DeleteIcon } from "@chakra-ui/icons";

export default function Page() {
  const { data } = useSession();

  const {
    cart,
    addInitialCartData,
    incrementQuantity,
    decrementQuantity,
    totalAmount,
    removeProduct,
  } = useCart();

  console.log(cart, cart.length);

  useEffect(() => {
    if (data?.user?.userId) {
      fetch("http://localhost:8000/api/cart", {
        method: "POST",
        body: JSON.stringify({ userId: data.user.userId }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched data:", data);
          addInitialCartData(data.carts);
        })
        .catch((error) => console.error("Fetch error:", error));
    }
  }, [data?.user?.userId]);

  function calculateTotal() {
    let total = 0;
    cart.map((product) => {
      total +=
        Math.abs(product?.price * (product?.discount / 100) - product?.price) *
        product?.quantity;
    });

    return total;
  }

  const deleteProduct = async (id) => {
    try {
      console.log({ userId: data?.user?.userId, id });

      const api = await fetch("http://localhost:8000/api/cart/remove", {
        method: "DELETE",
        body: JSON.stringify({
          userId: data?.user?.userId,
          productId: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resp = await api.json();

      console.log(resp);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <Container maxW="100%" m={0} p={16}>
      <Box display={"flex"} gap={12}>
        <Box
          border={1}
          borderColor={"lightgray"}
          borderStyle={"solid"}
          flex={1}
          p={34}
        >
          {cart?.map((product) => (
            <Box display={"flex"} alignItems={"start"} gap={"28px"}>
              <Box width={"128px"} height={"152px"} overflow={"hidden"}>
                <Image
                  src={product?.image}
                  alt={product?.name}
                  objectFit={"cover"}
                /> 
              </Box>
              <Box>
                <Heading size={"md"}>{product?.name}</Heading>
                <Text>{product?.description}</Text>

                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  minWidth={"lg"}
                >
                  <Text>
                    ₹{" "}
                    {Math.abs(
                      product?.price * (product?.discount / 100) -
                        product?.price
                    ).toFixed(2)}
                  </Text>
                  <Text as="s" color={"grayText"}>
                    ₹ {Math.abs(product?.price).toFixed(2)}
                  </Text>

                  <Box display={"flex"} alignItems={"center"} gap={"16px"}>
                    <Button
                      size={"xs"}
                      borderRadius="100px"
                      onClick={() => decrementQuantity(product?._id)}
                    >
                      -
                    </Button>
                    <Text as="b">{product?.quantity}</Text>
                    <Button
                      size={"xs"}
                      borderRadius="100px"
                      onClick={() => incrementQuantity(product?._id)}
                    >
                      +
                    </Button>
                  </Box>
                  <Button
                    variant="ghost"
                    borderRadius={"100px"}
                    colorScheme={"red"}
                    onClick={() => removeProduct(product?._id)}
                  >
                    <DeleteIcon color={"red"} />
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          p={34}
          border={1}
          borderColor={"lightgray"}
          borderStyle={"solid"}
          minWidth={"30%"}
        >
          <Heading size={"md"} marginBottom="22px">
            Order Summary
          </Heading>

          <Box
            display="flex"
            alignItems={"center"}
            justifyContent={"space-between"}
            fontWeight="medium"
          >
            <Text fontSize="xl" size={"md"}>
              Amount payable:
            </Text>
            <Text fontSize="xl" size={"md"}>
              ₹ {calculateTotal().toFixed(2)}
            </Text>
          </Box>
          <Text fontSize="sm" color="GrayText">
            Tax included. Shipping calculated at checkout.
          </Text>

          <Heading size="sm" marginY="10px">
            Special Delivery Instructions
          </Heading>
          <Textarea
            size="sm"
            padding={"14px"}
            borderRadius={"8px"}
            marginY="10px"
          />
          <Button
            variant={"solid"}
            color={"whitesmoke"}
            _hover={{
              color: "black",
              backgroundColor: "whitesmoke",
            }}
            backgroundColor={"black"}
            minWidth={"100%"}
          >
            Proceed to checkout
          </Button>
        </Box>
      </Box>
    </Container>
  );
}