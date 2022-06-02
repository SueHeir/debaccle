import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
const yourModuleName = require("react-map-interaction");
const { MapInteractionCSS } = yourModuleName;
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Box,
  AspectRatio,
  Image,
} from "@chakra-ui/react";
import { updateExpression } from "@babel/types";
// import Image from "next/image";
interface ImageModalInterface {
  src: string;
}

export const ImageModal: React.FC<ImageModalInterface> = ({ src }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ scale, translation }, setScaleTranslation] = useState({
    scale: 1,
    translation: { x: 0, y: 0 },
  });

  return (
    <>
      {/* <AspectRatio ratio={10 / 9.5} m={2}> */}
      <Image
        margin={"auto"}
        onClick={onOpen}
        src={src}
        clipPath={"fill-box"}
        maxHeight={"700px"}
      ></Image>
      {/* </AspectRatio> */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h={"100%"} w={"100%"} m={0} bgColor="Black">
          <MapInteractionCSS
            h={"100%"}
            w={"100%"}
            scale={scale}
            translation={translation}
            onClick={(value: any) => {
              setScaleTranslation(value);
              console.log("change");
            }}
            // translationBounds={{ xMin: 0 }}
          >
            <Image
              src={src}
              // pt={"25%"}
              // pb={"25%"}
            ></Image>
          </MapInteractionCSS>
          {/* <Image src={src} h={"100%"} w={"100%"}></Image> */}
          <ModalCloseButton onClick={onClose} />
          {/* </ModalBody> */}

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
};
export default ImageModal;
