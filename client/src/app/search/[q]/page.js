"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Container, Heading, Image, Stack } from "@chakra-ui/react";

export default function Page({ params }) {
  const [searchResults, setSearchResults] = useState();
  const query = params?.q;

  useEffect(() => {
    async function getBooks() {
      const response = await fetch(
        `http://localhost:8000/api/books/find/${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setSearchResults(data?.books);
    }

    getBooks();
  }, [query]);

  return (
    <Container p={0} maxW="100%" m={0}>
      <Box p={8}>
        <Heading mb={6} fontSize={25} color="#444444" textAlign="center">Search Results</Heading>

        {searchResults?.map((result) => (
          <Box
            key={result._id}
            mb={4}
            textAlign="center" 
          >
            <Image
              objectFit="cover"
              maxW={{ base: "100%", sm: "200px" }}
              src={result?.image}
              alt=""
            />
            <Stack p={4} spacing={2}>
              <Heading size="md">{result.name}</Heading>
              <Button variant="solid" colorScheme="blue">
                ADD TO BAG
              </Button>
            </Stack>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
