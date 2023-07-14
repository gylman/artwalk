import {
  Button,
  Dialog,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import type { TransitionProps } from "@mui/material/transitions";
import { type Dispatch, type SetStateAction, forwardRef } from "react";
import { DialogContent } from "@mui/material";
import { Dayjs } from "dayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TopBar } from "../../components/TopBar";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type FilterItemSpec =
  | {
      type: "select";
      id: string;
      label: string;
      options: string[];
      helperText?: string;
    }
  | {
      type: "datetime";
      id: string;
      label: string;
    };
type FilterSpecBase = FilterItemSpec[];

export function FilterChallengeDialog<FilterSpec extends FilterSpecBase>({
  isOpen,
  setIsOpen,
  spec,
  values,
  setValues,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  spec: FilterSpec;
  values: {
    [key in keyof FilterSpec]: FilterSpec[key]["type"] extends "date"
      ? Dayjs
      : string;
  };
  setValues;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={() => setIsOpen(false)}
        TransitionComponent={Transition}
      >
        <TopBar
          title="Filter Challenge"
          before={
            <IconButton
              sx={{ marginX: "0px" }}
              size="large"
              edge="start"
              color="inherit"
              onClick={() => setIsOpen(false)}
              aria-label="close"
            >
              <ArrowBack />
            </IconButton>
          }
        />

        <DialogContent
          sx={{
            backgroundColor: "#F6F4F8",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: "24px",
            width: "100%",
          }}
        >
          {spec.map((item) => {
            switch (item.type) {
              case "select": {
                return (
                  <TextField
                    key={item.id}
                    select
                    label={item.label}
                    value={values[item.id]}
                    SelectProps={{ native: true }}
                    sx={{
                      width: "100%",
                      "& select": {
                        fontFamily: "'Mona Sans' !important",
                      },
                    }}
                    helperText={item.helperText}
                    variant="standard"
                    onChange={(e) => {
                      setValues((v) => ({
                        ...v,
                        [item.id]: e.target.value,
                      }));
                    }}
                  >
                    {item.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                );
              }

              case "datetime": {
                return (
                  <DateTimePicker
                    key={item.id}
                    sx={{
                      "& label": {
                        transform: "none !important",
                        fontSize: "12px !important",
                        position: "relative !important",
                      },
                      "& input": {
                        padding: "4px 24px 5px 0",
                        fontFamily: "Mona Sans",
                      },
                      "& fieldset": {
                        borderWidth: "0px 0px 1px",
                        borderRadius: 0,
                      },
                      "& .Mui-focused fieldset": {
                        borderWidth: "0px 0px 2px !important",
                      },
                    }}
                    label={item.label}
                    value={values[item.id]}
                    onChange={(newValue) => {
                      setValues((v) => ({
                        ...v,
                        [item.id]: newValue,
                      }));
                    }}
                  />
                );
              }
            }
          })}

          {/* Theme */}

          <Button
            variant="contained"
            color="primary"
            style={{
              position: "absolute",
              bottom: "48px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "0 20px",
              fontSize: 14,
              height: 48,
              borderRadius: 24,
              color: "#9afcc5",
              width: "fit-content",
              letterSpacing: "1px",
            }}
            disableElevation
            onClick={() => setIsOpen(false)}
          >
            Apply filter
          </Button>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}
