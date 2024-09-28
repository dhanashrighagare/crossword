import React from "react";
import {
  Box,
  Image,
  Text,
  Button,
  ButtonGroup,
  useToast,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";

import { useSession } from "next-auth/react";
import Link from "next/link";
import useCart from "@/providers/CartState";
import useWishlist from "@/providers/WishlistState";

const Item = ({ id, image, name, author, price, discount }) => {
  const { data } = useSession();
  const toast = useToast();

  const { cart, addProduct } = useCart();
  const { wishlist, addProductInWishlist, removeProductInWishlist } = useWishlist();

  const discountedPrice = Math.abs(price * (discount / 100) - price);

  function isExist(productid) {
    return cart?.some((book) => book._id === productid);
  }

  const handleWishlist = async () => {
    addProductInWishlist({
      id, image, name, author, price, discount
    })
  };

  const isProductExistInWishlist = async () => {
    fetch("http://localhost:8000/api/users/mywishlist", {
      method: "POST",
      body: JSON.stringify({
        userId: data?.user?.userId,
      }),
      
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsInWishlist(resp.exist);
      })  
      .catch((error) => console.error(error));
  };

  const removeFromWishlist = async (productId) => {
    removeProductInWishlist(productId);
  };

  const handleAddToBag = async () => {
    addProduct({ _id: id, image, quantity: 1, name, author, price, discount });
  }

  return (
    <Box p={10}>
      <Image src={image} alt={name} borderRadius="md" />
      <Stack mt="4" spacing="3">
        <Link href={`/bookdisplay/${id}`}>
          <Heading size="sm" noOfLines={1} color="#000">
            {name}
          </Heading>
        </Link>
        <Text color="#1f4f95">{author}</Text>
        <Box display="flex" alignItems="center" gap={3}>
          <Text color="black.600" fontSize="xl">
            {`₹ ${discountedPrice}`}
          </Text>
          {discount > 0 ? (
            <>
              {" "}
              <Text as="s" color="gray.500" fontSize="md">
                {`₹ ${price}`}
              </Text>
              <Text color="green.500" fontSize="md">
                ({`${discount}`}%)
              </Text>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Stack>
      <ButtonGroup spacing="2" justifyContent="center" mt={4}>

      {isExist(id) ? (
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
          }}>
            GO TO BAG
            </Button>
        ) : (
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
        )}
        {wishlist?.find((item) => item.id === id) ? (
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={() => removeFromWishlist(id)}
          >
            <IoMdHeart />
          </Button>
        ) : (
          <Button
            variant="solid"
            onClick={() => handleWishlist()}
          >
            <IoMdHeartEmpty />
          </Button>
        )}
      </ButtonGroup>
    </Box>
  );
};

export default Item;