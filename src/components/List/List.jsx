import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import Typography from "@mui/material/Typography";

const CheckableList = ({ items = [], displayKeys = [], onRowClick,descriptions=[], }) => {
  const [checked, setChecked] = React.useState([]); // Ensure array

  const handleToggle = (item) => () => {
    const currentIndex = checked.indexOf(item);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(item);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  if (!items || items.length === 0) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", padding: 2, color: "gray" }}>
        No items found
      </Typography>
    );
  }

  return (
    <List sx={{ width: "100%", marginBottom:"10px", bgcolor: "background.paper" ,paddingRight:"20px"}}>
      {items.map((item) => {
        const labelId = `checkbox-list-label-${item._id || item.id}`;
        const displayText = displayKeys
        .map((key, index) => `${descriptions[index] || ""}: ${item[key]}`) // Prepend descriptions
        .join(" - ");

        return (
          <ListItem key={item._id || item.id} disablePadding>
            <ListItemButton role={undefined} onClick={() => onRowClick?.(item)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.includes(item)}
                  tabIndex={-1}
                  disableRipple
                  onChange={handleToggle(item)}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={displayText} />
            </ListItemButton>
            <IconButton edge="end" aria-label="comments">
              <CommentIcon />
            </IconButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CheckableList;
