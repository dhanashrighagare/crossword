'use client';

import { useState, useEffect } from 'react';
import { Box, Input, Select, Button, Image, Stack, FormLabel, FormControl, Container, useToast } from '@chakra-ui/react';
import Sidebar from '../sidebar/page';

const AddBook = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [bookDetails, setBookDetails] = useState({
    name: '',
    author: '',
    price: '',
    discount: '',
    category: 'sudha-murthy',
    image: '',
    description: ''
  });
  const toast = useToast();

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setImagePreview(objectUrl);

      console.log(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreview(null);
    }
  }, [image, imagePreview]);

  const imageHandler = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const changeHandler = (e) => {
    setBookDetails({ ...bookDetails, [e.target.name]: e.target.value });
  };

  const addBook = async () => {
    try {
      let formData = new FormData();
      if (image) {
        formData.append('book', image);
      }

      console.log(bookDetails)
      console.log(formData)
  
      const uploadResponse = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
  
      const uploadData = await uploadResponse.json();
  
      if (uploadData.success) {
        const updatedBookDetails = { ...bookDetails, image: uploadData.image_url };
  
        const addBookResponse = await fetch('http://localhost:8000/api/books/addbook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            id: Math.random(1, 50200),
            ...updatedBookDetails
          }),
        });
  
        if (!addBookResponse.ok) {
          const errorText = await addBookResponse.text();
          throw new Error(`Add book failed: ${errorText}`);
        }
  
        const addBookData = await addBookResponse.json();
  
        if (addBookData.success) {
          toast({
            title: 'Book Added',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          setBookDetails({
            name: '',
            author: '',
            price: '',
            category: 'sudha-murthy',
            image: '',
          });
          setImage(null);
          setImagePreview(null);
        } else {
          toast({
            title: 'Failed to add book',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: 'Failed to upload image',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'An error occurred',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  return (     
      <Box display="flex"> 
        <Sidebar />
        
        <Box flex="1" p={6} maxW="1500px" mx="auto" ml={50} maxHeight="550px" overflowY="auto" >
          <Stack spacing={4}>
            <FormControl id="name">
              <FormLabel>Book Name</FormLabel>
              <Input
                value={bookDetails.name}
                onChange={changeHandler}
                type="text"
                name="name"
                placeholder="Type here"
              />
            </FormControl>

            <FormControl id="author">
              <FormLabel>Author Name</FormLabel>
              <Input
                value={bookDetails.author}
                onChange={changeHandler}
                type="text"
                name="author"
                placeholder="Type here"
              />
            </FormControl>

            <FormControl id="price">
              <FormLabel>Book Price</FormLabel>
              <Input
                value={bookDetails.price}
                onChange={changeHandler}
                type="text"
                name="price"
                placeholder="Type here"
              />
            </FormControl>

            <FormControl id="price">
              <FormLabel>Discount Percentage</FormLabel>
              <Input
                value={bookDetails.discount}
                onChange={changeHandler}
                type="text"
                name="discount"
                placeholder="Type here"
              />
            </FormControl>

            <FormControl id="description">
              <FormLabel>Book Description</FormLabel>
              <Input
                value={bookDetails.description}
                onChange={changeHandler}
                type="text"
                name="description"
                placeholder="Type here"
              />
            </FormControl>

            <FormControl id="category">
              <FormLabel>Book Category</FormLabel>
              <Select
                value={bookDetails.category}
                onChange={changeHandler}
                name="category"
              >
                <option value="sudha-murthy">Sudha Murthy</option>
                <option value="cozy-up">Cozy Up</option>
                <option value="preorder">Pre Order</option>
                <option value="thewriteplace">The Write Place</option>
                <option value="halfpricesale">Half Price Sale</option>
                <option value="legami">Legami</option>
                <option value="milan">Milan</option>
              </Select>
            </FormControl>

            <FormControl id="image">
              <FormLabel>Book Image</FormLabel>
              <label htmlFor="file-input">
                <Image
                  src={imagePreview || '/images/upload_area.svg'}
                  alt="Upload Area"
                  boxSize="150px"
                  objectFit="cover"
                  borderRadius="md"
                  cursor="pointer"
                />
              </label>
              <Input
                onChange={imageHandler}
                type="file"
                id="file-input"
                hidden
              />
            </FormControl>

            <Button bg={'black'} color="white" onClick={addBook}>
              ADD BOOK
            </Button>
          </Stack>
        </Box>

      </Box>
  );
};

export default AddBook;
