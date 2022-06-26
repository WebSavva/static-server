import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import ProgressBar from "react-bootstrap/ProgressBar";
import axios from "axios";

import { ContentReader } from "../../utils/readContentDir";
import getPath from "../../utils/getPath";
import {
  serializeProps,
  deserializeNode,
  deserializeProps,
} from "../../utils/Node";

import DirectorySelect from "../../components/DirectorySelect";
import NavigationLink from "../../components/NavigationLink";

export async function getServerSideProps() {
  return {
    props: serializeProps({
      contentTree: ContentReader.read(),
    }),
  };
}
export default function UploadPage(props) {
  const { contentTree } = deserializeProps(props, {
    contentTree: deserializeNode,
  });

  const [pickedDirectory, setPickedDirectory] = useState(null);
  const [file, setFile] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [toDecompress, setToDecompress] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const { flatPath } = getPath(contentTree, pickedDirectory);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();

    formData.set("file", file);

    const apiUrl = new URL("/api/upload", globalThis.location.origin);

    if (pickedDirectory)
      apiUrl.searchParams.set("directoryId", pickedDirectory);

    if (toDecompress) apiUrl.searchParams.set("toDecompress", true);

    try {
      setIsUploading(true);

      await axios.post(apiUrl.toString(), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress({ loaded, total }) {
          setProgress(Math.round((loaded / total) * 1e2));
        },
      });

      router.push({
        pathname: "/folders",
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <NavigationLink />
      
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="fw-bold fs-5">Destination</Form.Label>

          <DirectorySelect path={flatPath} onChange={setPickedDirectory} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold fs-5">File</Form.Label>
          <Form.Control
            type="file"
            placeholder="Choose a file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Decompress"
            value={toDecompress}
            onChange={setToDecompress}
          />
        </Form.Group>

        {isUploading ? (
          <ProgressBar now={progress} />
        ) : (
          <Button
            variant="primary"
            type="submit"
            className="w-50 mx-auto d-block"
          >
            Submit
          </Button>
        )}
      </Form>
    </>
  );
}
