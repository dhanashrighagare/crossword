"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Image,
  Text,
  IconButton,
  HStack,
  Container,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { CloseIcon, SmallCloseIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Sidebar from "../sidebar/page";

const ListBook = () => {
  const [allbooks, setAllBooks] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/books/allbook");
      const data = await response.json();
      setAllBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Remove a book by ID
  const removeBook = async (productId) => {
    const r = confirm("Do you want to delete this product? ");
    if(!r) {
      return;
    }
    try {
        const api = await fetch("http://localhost:8000/api/books/removebook", {
            method: "DELETE",
            body: JSON.stringify({
              productId,
            }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      });
      const resp = await api.json();
      if(resp?.success) {
        alert(`${resp?.name} is deleted`);
      } else {
        alert(`${resp?.name} is not deleted`);
      }
      fetchInfo();
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  return (
    <Container maxW="container.x" p={0}>
      <Box display="flex">
        <Sidebar />

        <Box flex="1" p={4}>
          <Heading mb={4} textAlign="center" color="#303030">
            All Books List
          </Heading>
          <SimpleGrid columns={5} spacing={4} mb={4} fontWeight="bold">
            <Text>Image</Text>
            <Text>Book Name</Text>
            <Text>Price</Text>
            <Text>Category</Text>
            <Text>Actions</Text>
          </SimpleGrid>
          <Divider mb={4} />
          <Box maxHeight="490px" overflowY="auto">
            {allbooks.length > 0 ? (
              allbooks.map((book) => (
                <Box
                  key={book._id}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  mb={4}
                  display="grid"
                  gridTemplateColumns="1fr 2fr 1fr 1fr 1fr"
                  alignItems="center"
                >
                  <Image
                    src={book.image}
                    alt={book.name}
                    boxSize="50px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <Text>{book.name}</Text>
                  <Text>₹{book.price}</Text>
                  <Text>{book.category}</Text>
                  <HStack spacing={4}>
                    <NextLink href={`editbook/${book._id}`} passHref>
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        colorScheme="blue"
                        size="sm"
                      />
                    </NextLink>
                    <IconButton
                      onClick = {() => removeBook(book._id)}
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      size="sm"
                    />
                  </HStack>
                  {/* <SmallCloseIcon/> */}
                  {/* <IconButton
                                    aria-label="Remove book"
                                    icon={<CloseIcon />}
                                    onClick={() => removeBook(book._id)}
                                /> */}
                </Box>
              ))
            ) : (
              <Text>No books available.</Text>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ListBook;
