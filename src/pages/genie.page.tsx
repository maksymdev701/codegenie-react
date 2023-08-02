import { useEffect, useState } from "react";
import {
  Container,
  Link,
  Typography,
  Breadcrumbs,
  Divider,
  Grid,
  Stack,
  SvgIcon,
  Box,
  Tabs,
  Tab,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";

import { ReactComponent as TextIcon } from "../assets/ico_text.svg";
import { ReactComponent as ImageIcon } from "../assets/ico_image.svg";
import { ReactComponent as UrlIcon } from "../assets/ico_url.svg";
import { ReactComponent as WishIcon } from "../assets/ico_wish.svg";
import TotalPanel from "../components/genie/TotalPanel";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useGetProductQuery } from "../redux/api/productApi";
import { useRunPromptMutation } from "../redux/api/promptApi";
import { setMsg } from "../redux/features/genieSlice";

const loadTypes = [
  {
    icon: (
      <Box
        sx={{
          bgcolor: "#E06F41",
          padding: "10px",
          borderRadius: "4px",
          fontSize: "0px !important",
        }}
      >
        <SvgIcon>
          <TextIcon />
        </SvgIcon>
      </Box>
    ),
  },
  {
    icon: (
      <Box
        sx={{
          bgcolor: "#7AB65D",
          padding: "10px",
          borderRadius: "4px",
          fontSize: "0px !important",
        }}
      >
        <SvgIcon sx={{ bgcolor: "#7AB65D" }}>
          <ImageIcon />
        </SvgIcon>
      </Box>
    ),
  },
  {
    icon: (
      <Box
        sx={{
          bgcolor: "#0168B5",
          padding: "10px",
          borderRadius: "4px",
          fontSize: "0px !important",
        }}
      >
        <SvgIcon sx={{ bgcolor: "#0168B5" }}>
          <UrlIcon width={24} height={24} />
        </SvgIcon>
      </Box>
    ),
  },
];

const CodeBox = styled(Box)(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? "#737373" : "#E3E3E3",
  borderRadius: 4,
  height: "500px",
  overflow: "auto",
  "::-webkit-scrollbar": {
    width: 4,
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.divider,
    borderRadius: 4,
  },
  "::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.mode === "dark" ? "#2D2D2D" : "#fff",
  },
}));

const GeniePage = () => {
  const [value, setValue] = useState(0);
  const [code, setCode] = useState(`<?php
  session_start();
  if(isset($_POST['submit'])){ //don't show the error if Submit button not clicked.
  $username = filter_input(INPUT_POST,'username', FILTER_SANITIZE_SPECIAL_CHARS);
  $password = $_POST['password'];
  if ($username == 'john' && $password == 'password') {
  $_SESSION['username'] = $username;
  header('Location: /php_course/extras/dashboard.php');
  } else {
  echo 'Incorrect Login';
  }
}
  `);

  const genieSelector = useAppSelector((state) => state.genieState);
  const dipatch = useAppDispatch();

  const productState = useGetProductQuery({
    _id: "",
    product_name: "CodeGenie",
    product_module: genieSelector.module ? genieSelector.module : "",
  });

  const [runPrompt, runState] = useRunPromptMutation();

  useEffect(() => {
    if (runState.isSuccess) {
      toast.success("Executed successfully");
      dipatch(setMsg(runState.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runState]);

  if (productState.isLoading || productState.isFetching || !productState.data)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Home
    </Link>,
    <Typography key="3" color="text.primary">
      {genieSelector.module}
    </Typography>,
  ];

  const {
    source_check,
    source_text,
    source_image,
    source_url,
    input_box_title,
  } = productState.data;

  return (
    <Container maxWidth="xl" sx={{ height: "calc(100vh - 100px)" }}>
      <Stack height="100%">
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ marginY: 3 }}
        >
          {breadcrumbs}
        </Breadcrumbs>
        <Divider />
        <Grid container flexGrow={1}>
          <Grid item xs={5} paddingTop={5} paddingRight={2}>
            <Stack spacing={3} height="100%">
              <Tabs
                onChange={(e: React.SyntheticEvent, newValue: number) =>
                  setValue(newValue)
                }
                value={value}
                sx={{
                  "& .MuiTabs-scroller .MuiTabs-flexContainer": { gap: 2 },
                }}
              >
                {source_check.includes("source_text") && (
                  <Tab
                    sx={{
                      width: "30%",
                      justifyContent: "left",
                      padding: "8px 16px",
                      border: "1px solid",
                      borderColor: "inherit",
                      borderRadius: 1,
                    }}
                    iconPosition="start"
                    icon={loadTypes[0].icon}
                    label={source_text}
                  />
                )}
                {source_check.includes("source_image") && (
                  <Tab
                    sx={{
                      width: "30%",
                      justifyContent: "left",
                      padding: "8px 16px",
                      border: "1px solid",
                      borderColor: "inherit",
                      borderRadius: 1,
                    }}
                    iconPosition="start"
                    icon={loadTypes[1].icon}
                    label={source_image}
                  />
                )}
                {source_check.includes("source_url") && (
                  <Tab
                    sx={{
                      width: "30%",
                      justifyContent: "left",
                      padding: "8px 16px",
                      border: "1px solid",
                      borderColor: "inherit",
                      borderRadius: 1,
                    }}
                    iconPosition="start"
                    icon={loadTypes[2].icon}
                    label={source_url}
                  />
                )}
              </Tabs>
              <Typography variant="h4" color="text.secondary">
                {input_box_title}
              </Typography>

              <CodeBox>
                <CodeEditor
                  value={code}
                  language="js"
                  placeholder="Please enter JS code."
                  onChange={(evn) => setCode(evn.target.value)}
                  padding={15}
                  style={{
                    fontSize: 16,
                    backgroundColor: "inherit",
                    fontFamily:
                      "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                  }}
                />
              </CodeBox>
              <Stack alignItems="end">
                <LoadingButton
                  startIcon={
                    <SvgIcon>
                      <WishIcon />
                    </SvgIcon>
                  }
                  loading={runState.isLoading}
                  sx={{
                    background:
                      "linear-gradient(270deg, #4BA5EB 0%, #0168B5 100%)",
                    marginLeft: 5,
                    color: "white",
                    paddingX: "20px",
                    paddingY: "12px",
                    borderRadius: "4px",
                    width: "fit-content",
                  }}
                  onClick={() => {
                    runPrompt({
                      product_name: "CodeGenie",
                      product_module: genieSelector.module
                        ? genieSelector.module
                        : "",
                      prompt_name: genieSelector.prompt_name
                        ? genieSelector.prompt_name
                        : "",
                      code: code,
                    });
                  }}
                >
                  Execute Wish
                </LoadingButton>
              </Stack>
            </Stack>
          </Grid>
          <Divider orientation="vertical" />
          <Grid item xs={6.9} pl="24px" pt="40px">
            <TotalPanel />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default GeniePage;