'use client'
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography, IconButton, CssBaseline } from "@mui/material";
import { collection, deleteDoc, getDocs, query, getDoc, doc, setDoc } from "firebase/firestore";
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from "@/theme";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach(doc => {
        inventoryList.push({
          name: doc.id,
          ...doc.data()
        });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory: ", error);
    }
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const itemLowerCase = item.toLowerCase();
    const docRef = doc(collection(firestore, "inventory"), itemLowerCase);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <IconButton
          sx={{ position: 'absolute', top: 16, right: 16 }}
          onClick={() => setDarkMode(!darkMode)}
          color="inherit"
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="background.paper"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: "translate(-50%,-50%)"
            }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }} />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}>Add</Button>
            </Stack>
          </Box>
        </Modal>
        <Button
          variant="contained"
          onClick={() => {
            handleOpen();
          }}>
          Add New Item
        </Button>

        <Box
          width="50%"
          display="flex"
          justifyContent="center"
          sx={{ border: '1px solid', borderColor: 'primary.main', mb: 2 }}
        >
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search Inventory"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        <Box border="1px solid #333">
          <Box width="800px" height="100px" bgcolor="#ADD8E6" display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center">
            <Typography variant="h2" color="#333">
              Inventory Items
            </Typography>
          </Box>
        </Box>
        <Stack minWidth="500px" width="100%" maxWidth="800px" height="300px" spacing={2} overflow="auto">
          {
            filteredInventory.map(({ name, quantity }) => (
              <Box key={name} width="100%" minHeight="100px" display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}>

                <Typography variant="h4" color="#333" textAlign="center" width="20%" minWidth="30px">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h4" color="#333" textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={() => addItem(name)}>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
