import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Rating from "../components/Rating";
import Facilities from "../components/Facilities";
import Review from "../components/Review";
import FACILITIES from "../constants/facilities";
import NavbarBack from "../components/NavbarBack";
import axios from "axios";
import CustomNotification from "../components/CustomNotification";

const AddPlace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const position = location.state?.position || null;
  const MAX_IMAGES = 10;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const [formData, setFormData] = useState({
    namaTempat: "",
    detailAlamat: "",
    fotos: [],
    rating: 0,
    ulasan: "",
    selectedFacilities: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [notification, setNotification] = useState({ show: false, type: "", title: "", message: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFacilityToggle = (facilityId) => {
    setFormData((prevData) => {
      const currentSelected = [...prevData.selectedFacilities];
      if (currentSelected.includes(facilityId)) {
        return {
          ...prevData,
          selectedFacilities: currentSelected.filter((id) => id !== facilityId),
        };
      } else {
        return {
          ...prevData,
          selectedFacilities: [...currentSelected, facilityId],
        };
      }
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating,
    });
  };

  const handleFotoChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadError("");

    if (formData.fotos.length + files.length > MAX_IMAGES) {
      setUploadError(`Maksimal ${MAX_IMAGES} gambar diperbolehkan`);
      return;
    }

    const validFiles = [];
    const validPreviews = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`File "${file.name}" melebihi batas ukuran 5MB`);
        return;
      }

      validFiles.push(file);

      const fileReader = new FileReader();
      fileReader.onload = () => {
        validPreviews.push({
          url: fileReader.result,
          name: file.name,
        });

        if (validPreviews.length === validFiles.length) {
          setPreviewUrls([...previewUrls, ...validPreviews]);
          setFormData({
            ...formData,
            fotos: [...formData.fotos, ...validFiles],
          });
        }
      };
      fileReader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const updatedFotos = [...formData.fotos];
    const updatedPreviews = [...previewUrls];

    updatedFotos.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFormData({
      ...formData,
      fotos: updatedFotos,
    });
    setPreviewUrls(updatedPreviews);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedFotos = [...formData.fotos];
    const reorderedPreviews = [...previewUrls];

    const [removedFoto] = reorderedFotos.splice(result.source.index, 1);
    const [removedPreview] = reorderedPreviews.splice(result.source.index, 1);

    reorderedFotos.splice(result.destination.index, 0, removedFoto);
    reorderedPreviews.splice(result.destination.index, 0, removedPreview);

    setFormData({
      ...formData,
      fotos: reorderedFotos,
    });
    setPreviewUrls(reorderedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!position) {
      setUploadError(
        "Posisi tidak tersedia. Silakan pilih lokasi pada peta terlebih dahulu."
      );
      return;
    }

    if (formData.fotos.length === 0) {
      setUploadError("Silakan pilih minimal satu foto tempat");
      return;
    }

    setIsLoading(true);
    setUploadError("");
    setNotification({
      show: true,
      type: "loading",
      title: "Mengirim Data...",
      message: "Mohon tunggu, tempat sedang disubmit",
    });

    try {
      const token = localStorage.getItem("auth_header");
      const formDataObj = new FormData();
      formDataObj.append("name", formData.namaTempat);
      formDataObj.append("address", formData.detailAlamat);
      formDataObj.append("comment", formData.ulasan);
      formDataObj.append("latitude", position.lat);
      formDataObj.append("longitude", position.lng);
      formDataObj.append("rating", formData.rating);

      if (formData.selectedFacilities.length > 0) {
        formDataObj.append(
          "facilities",
          JSON.stringify(formData.selectedFacilities)
        );
      }

      formData.fotos.forEach((foto) => {
        formDataObj.append("images[]", foto);
      });

      const response = await axios.post(
        "https://easygo-api-production-d477.up.railway.app/api/places",
        formDataObj,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        setNotification({
          show: true,
          type: "success",
          title: "Tempat Berhasil Disubmit!",
          message: "Tempat berhasil disubmit dan menunggu persetujuan admin.",
        });

        setTimeout(() => {
          setNotification({ show: false, type: "", title: "", message: "" });
          navigate("/dashboard");
        }, 3000);
      } else {
        setUploadError(
          response.data.message || "Terjadi kesalahan saat menyimpan data"
        );
        setNotification({ show: false, type: "", title: "", message: "" });
      }
    } catch (error) {
      setNotification({ show: false, type: "", title: "", message: "" });
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        const firstError = Object.values(validationErrors)[0][0];
        setUploadError(firstError || "Data tidak valid");
      } else {
        setUploadError(
          error.response?.data?.error ||
            "Terjadi kesalahan saat menghubungi server"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = (formData.fotos.length / MAX_IMAGES) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pt-20">
      <NavbarBack title="Tambah Tempat" showAvatar={false} />

      {/* Notification - Loading or Success */}
      {notification.show && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <CustomNotification
            title={notification.title}
            type={notification.type}
            onClose={() =>
              setNotification({ show: false, type: "", title: "", message: "" })
            }
          >
            {notification.message}
          </CustomNotification>
        </div>
      )}

      <div className="container mx-auto max-w-lg px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Masukkan Tempat</h1>

        {!position && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p>Silakan pilih lokasi pada peta terlebih dahulu</p>
          </div>
        )}

        {uploadError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{uploadError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="namaTempat"
              placeholder="Nama Tempat"
              value={formData.namaTempat}
              onChange={handleInputChange}
              className="border-2 border-[#3C91E6] rounded-lg p-3 w-full focus:outline-none focus:border-3"
              required
            />
            <input
              type="text"
              name="detailAlamat"
              placeholder="Detail Alamat"
              value={formData.detailAlamat}
              onChange={handleInputChange}
              className="border-2 border-[#3C91E6] rounded-lg p-3 w-full focus:outline-none focus:border-3"
              required
            />
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={() => document.getElementById("fotoUpload").click()}
                className="bg-[#3C91E6] hover:bg-[#3c80e6] text-white rounded-lg p-3 flex-1 flex justify-center items-center"
                disabled={formData.fotos.length >= MAX_IMAGES || isLoading}
              >
                <img
                  src="/icons/sampul.png"
                  alt="Camera Icon"
                  className="mr-2 w-6 h-6"
                />
                Tambah Foto Sampul
              </button>
            </div>

            <div className="w-full h-5 bg-gray-200 rounded-full mt-3 relative overflow-hidden">
              <div
                className="h-full bg-[#3C91E6] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-sm">
                {formData.fotos.length} dari {MAX_IMAGES} gambar ditambahkan
              </div>
            </div>

            <input
              type="file"
              id="fotoUpload"
              onChange={handleFotoChange}
              className="hidden"
              accept="image/*"
              multiple
              disabled={formData.fotos.length >= MAX_IMAGES || isLoading}
            />

            {previewUrls.length > 0 && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="images" direction="horizontal">
                  {(provided) => (
                    <div
                      className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {previewUrls.map((preview, index) => (
                        <Draggable
                          key={`${preview.name}-${index}`}
                          draggableId={`${preview.name}-${index}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`relative border rounded overflow-hidden cursor-move ${
                                snapshot.isDragging ? "opacity-75" : ""
                              }`}
                            >
                              <img
                                src={preview.url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                              >
                                ✕
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                {index + 1}. {preview.name}
                              </div>
                              {index === 0 && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                  Cover
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}

            <div className="text-xs text-gray-500 text-center mt-2">
              Maks. {MAX_IMAGES} gambar, ukuran maks. per gambar 5MB.
            </div>
          </div>

          <Rating
            rating={formData.rating}
            onRatingChange={handleRatingChange}
          />
          <div className="mb-6 relative left-1/2 -translate-x-1/2 w-full min-w-3xl mx-auto">
            <Facilities
              facilities={FACILITIES}
              selectedFacilities={formData.selectedFacilities}
              onFacilityToggle={handleFacilityToggle}
            />
          </div>

          <div className="mb-6">
            <div className="relative left-1/2 -translate-x-1/2 min-w-2xl">
              <Review
                review={formData.ulasan}
                onReviewChange={(e) =>
                  handleInputChange({
                    target: { name: "ulasan", value: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !position}
            className={`${
              isLoading || !position
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#3C91E6] hover:bg-[#3c80e6]"
            } text-white rounded p-3 w-1/2 flex justify-center items-center mx-auto transition-colors`}
          >
            Tambahkan Tempat
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlace;