import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { TextInput, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import useMobileDetect from "../utils/useMobileDetect";

export default function Home() {
  const form = useForm({
    initialValues: {
      bitStream: "",
    },

    validate: {
      bitStream: (value) => {
        if (!value.match(/^[01\s]+$/)) {
          return "Please enter a valid bit stream";
        }
      },
    },
  });
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [bitStream, setBitStream] = useState<string | null>(null);
  const currentDevice = useMobileDetect();

  useEffect(() => {
    (async () => {
      if (bitStream) {
        const res = await fetch(`/api/generate?bitStream=${bitStream}`);
        const data = await res.json();

        setWidth(data.width);
        setHeight(data.height);

        // Create url for the base64 image
        const url = `data:image/png;base64,${data.image}`;
        setImage(url);
      }
    })();
  }, [bitStream]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Binary to Analog Transmission Modes Visualizer</title>
        <meta
          name="description"
          content="Using this website you can generate all the binary to analog transmission modes waveforms."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <main className={styles.main}>
        <Image
          src="/logo.png"
          alt="Binary to Analog Transmission Modes Visualizer"
          className={styles.logo}
          width={100}
          height={100}
        />
        <h1 className={styles.title}>
          Welcome to Binary to Analog Transmission Modes Visualizer! ✨
        </h1>

        <p className={styles.description}>
          Get started by providing a bit stream below.
        </p>

        <Box sx={{ maxWidth: 300 }} mx="auto">
          <form
            onSubmit={form.onSubmit((values) => setBitStream(values.bitStream))}
          >
            <TextInput
              withAsterisk
              label="Bit Stream"
              placeholder="0 1 1 0"
              {...form.getInputProps("bitStream")}
            />

            <Group position="right" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
        <br />
        <br />
        {image ? (
          <>
            <h1>Generated Waveforms: </h1>
            {currentDevice.isMobile() ? (
              <div
                style={{
                  overflow: "scroll",
                  overflowX: "scroll",
                  height: "100%",
                  width: "100%",
                  position: "relative",
                  margin: "0 auto",
                }}
              >
                <Image
                  src={image}
                  alt="Binary to Analog Transmission Modes Visualizer"
                  width={width}
                  height={height}
                />
              </div>
            ) : (
              <div
                style={{
                  overflow: "scroll",
                  overflowX: "scroll",
                  height: height,
                  width: width,
                  position: "relative",
                  margin: "0 auto",
                }}
              >
                <Image
                  src={image}
                  alt="Binary to Analog Transmission Modes Visualizer"
                  width={width}
                  height={height}
                />
              </div>
            )}
            <br />
            <br />
            <Button
              onClick={() => {
                const a = document.createElement("a");
                a.href = image;
                a.download = "image.png";
                a.click();
              }}
              variant="gradient"
            >
              Download Image
            </Button>
          </>
        ) : null}
      </main>
    </div>
  );
}
