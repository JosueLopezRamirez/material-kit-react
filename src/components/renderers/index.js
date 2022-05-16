import CloseIcon from "@mui/icons-material/Close";
import { Input, MenuItem, Switch, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";

const useStyles = makeStyles({
  remove: {
    display: "flex",
    justifyContent: "center",
    height: "30px",
    alignItems: "center",
    color: "#aaaaaa",
    "&:hover": {
      color: "#ff3823",
    },
  },
  switch: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  select: {
    height: "30px",
  },
  selectInput: {
    borderRadius: 0,
    fontSize: 14,
    height: "30px",
  },
});

export const RemoveRenderer = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.remove}>
      <CloseIcon fontSize="small" />
    </div>
  );
};

export const SwitchRenderer = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.switch}>
      <Switch
        size="small"
        color="success"
        defaultChecked={props.value}
        onChange={(val) => props.setValue(val.target.checked)}
        inputProps={{ "aria-label": "controlled" }}
      />
    </div>
  );
};

export const SelectRenderer = forwardRef((props, ref) => {
  const classes = useStyles();

  const [value, setValue] = useState(props.value);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      },
    };
  });

  const onChange = (event) => {
    console.log("value", event.target.value);
    console.log(props);
    props.setValue(event.target.value);
    setValue(event.target.value);
  };

  return (
    <TextField
      select
      fullWidth
      InputProps={{ classes: { root: classes.selectInput } }}
      classes={{ root: classes.select }}
      ref={ref}
      value={value}
      onChange={onChange}
    >
      {props.options.map((option) => (
        <MenuItem value={option.value}>{option.label}</MenuItem>
      ))}
    </TextField>
  );
});

export const InputOnlyLettersRenderer = forwardRef((props, ref) => {
  const classes = useStyles();

  const [value, setValue] = useState(props.value);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      },
    };
  });

  const onChange = (event) => {
    const result = event.target.value.replace(/[^a-z]/gi, "");
    props.setValue(result);
    setValue(result);
  };

  return (
    <TextField
      type="text"
      fullWidth
      InputProps={{ classes: { root: classes.selectInput } }}
      classes={{ root: classes.select }}
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
});
