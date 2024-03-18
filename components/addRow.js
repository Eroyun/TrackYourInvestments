import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { addRow } from "../helpers/stockHelper"; // adjust the path to your stockHelper file

function AddRowButton({ firstSheetData, setFirstSheetData }) {
  const [open, setOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: "",
    stock: "",
    quantity: 0,
    price: 0,
  });

  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newRow = [
      newEntry.date,
      newEntry.stock,
      newEntry.quantity,
      newEntry.price,
      newEntry.quantity * newEntry.price,
    ];
    const finalData = addRow(firstSheetData, newRow);
    setFirstSheetData(finalData);
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        Add new entry
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add new entry</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="date"
            label="Buy Date"
            type="date"
            fullWidth
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="stock"
            label="Stock"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="quantity"
            label="Buy Quantity"
            type="number"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Stock Price"
            type="number"
            fullWidth
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddRowButton;
