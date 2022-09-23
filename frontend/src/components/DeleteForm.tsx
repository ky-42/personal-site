import React, { useState } from "react";
import styled from "styled-components";

import PasswordSubmit from "./PasswordSubmit";

interface DeleteFormProps {
  existingData: string,
  submitFunc: React.Dispatch<React.SetStateAction<string>>
}

const DeleteForm = () => {
  const [deleteSlug, setDeleteSlug] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form>
      <fieldset>
        <label >
          Slug to delete:
          <input type="text" value={deleteSlug} onChange={(event) => setDeleteSlug(event.target.value)} />
        </label>
      </fieldset>
      <PasswordSubmit password={password} setPassword={setPassword} />
    </form>
  )
}

export default DeleteForm;