import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFilterById, updateFilter } from "../../api/apiClient"; // ✅ ensure getFilterById exists
import FilterBuilder from "./FilterBuilder";
import CryptoJS from 'crypto-js'

const EditFilter: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState<any>(null);

  const { id: encryptedId } = useParams();
  const [id, setId] = useState<string | null>(null);
  const secretKey = (process.env.REACT_APP_ENCRYPT_SECRET_KEY as string);

  useEffect(() => {
    if (encryptedId) {
      try {
        const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), secretKey);
        const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
        setId(decryptedId);
        console.log("Decrypted ID:", decryptedId);
      } catch (error) {
        console.error("Failed to decrypt ID:", error);
        setId(null);
      }
    }
  }, [encryptedId, secretKey]);

  useEffect(() => {
    const fetchFilter = async () => {
      try {
        const response = await getFilterById(id as string);
        console.log("Fetched filter data 1:", response);
        setFilterData(response);
      } catch (error) {
        console.error("Failed to load filter:", error);
        alert("Failed to load filter data");
        navigate("/filters");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFilter();
  }, [id, navigate]);

  const handleSave = async (updatedData: any) => {
    try {
      await updateFilter(id as string, updatedData);
    } catch (error) {
      console.error("Failed to update filter:", error);
      alert("Update failed.");
    }
  };

  if (loading) return <div>Loading filter...</div>;

  return (
    <>
      <FilterBuilder
        mode="edit"
        initialData={filterData}
        onSave={handleSave}
        onDiscard={()=>navigate("/filters?isDraft=false")}
      />
    </>
  );
};

export default EditFilter;
