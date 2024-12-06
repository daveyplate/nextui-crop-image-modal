# @daveyplate/nextui-crop-image-modal

Shows a modal to crop an image.

## Installation

You can install the package via npm:

```sh
npm install @daveyplate/nextui-crop-image-modal
```

## Basic Usage

Here is an example of how to use the 

CropImageModal

 component in your React application:

```jsx
import React, { useState } from 'react';
import CropImageModal from '@daveyplate/nextui-crop-image-modal';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleConfirm = (file) => {
    setCroppedImage(file);
    setImageFile(null);
  };

  const handleError = (error) => {
    console.error(error);
    setImageFile(null);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {imageFile && (
        <CropImageModal
          imageFile={imageFile}
          setImageFile={setImageFile}
          imageSize={{ width: 300, height: 300 }}
          onConfirm={handleConfirm}
          onError={handleError}
        />
      )}
      {croppedImage && <img src={URL.createObjectURL(croppedImage)} alt="Cropped" />}
    </div>
  );
}

export default App;
```

## Localization

You can customize the text displayed in the modal by providing a 

localization

 prop to the 

CropImageModal

 component. The 

localization

 prop should be an object with the following structure:

```js
/**
 * @typedef {Object} CropModalLocalization
 * @property {string} [header="Crop Image"] - The header text of the modal
 * @property {string} [cancel="Cancel"] - The text of the cancel button
 * @property {string} [confirm="Confirm"] - The text of the confirm button
 */

const localization = {
  header: "Recortar Imagen",
  cancel: "Cancelar",
  confirm: "Confirmar"
};
```

Example usage with localization:

```jsx
<CropImageModal
  imageFile={imageFile}
  setImageFile={setImageFile}
  imageSize={{ width: 300, height: 300 }}
  onConfirm={handleConfirm}
  onError={handleError}
  localization={localization}
/>
```

For more details, please refer to the [documentation](https://github.com/daveyplate/nextui-crop-image-modal).