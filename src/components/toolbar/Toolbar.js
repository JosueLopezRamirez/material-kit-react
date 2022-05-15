import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import { useState } from "react";
import { Search as SearchIcon } from "../../icons/search";

export const Toolbar = (props) => {
  const { title, btnText, onClickBtn, searchText, onSearch, onlySearch, ...rest } = props;

  const renderButton = () => {
    const element = (
      <Button color="primary" variant="contained">
        <span onClick={onClickBtn}>{btnText}</span>
      </Button>
    );
    if (props.wrapper) return props.wrapper(element);
    return element;
  };

  return (
    <Box {...rest}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          {title}
        </Typography>
        <Box sx={{ m: 1 }}>{renderButton()}</Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card sx={{ borderRadius: 0 }}>
          <CardContent>
            <Grid container>
              <Grid item lg={onlySearch ? 12 : 4} md={onlySearch ? 12 : 4} sm={12}>
                <TextField
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder={searchText}
                  variant="outlined"
                  onChange={onSearch}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
