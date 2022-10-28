import React from "react";
import { DeleteState } from "../../types/ManageContent";

interface DeleteFromProps {
  deleteData: DeleteState,
  setDeleteData: React.Dispatch<{field: keyof DeleteState, value: DeleteState[keyof DeleteState]}| DeleteState>
};

const DeleteForm = ({deleteData, setDeleteData}: DeleteFromProps) => {

  return (
    <form>
      <fieldset>
        <label >
          Slug to delete:
          <input type="text" value={deleteData.deleteSlug} onChange={(e) => setDeleteData({field: "deleteSlug", value: e.target.value})} />
        </label>
      </fieldset>
    </form>
  )
}

export default DeleteForm;