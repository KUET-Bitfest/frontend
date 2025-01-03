"use client";
import { useEffect, useState } from "react";
import ChangePasswordModal from "@/app/profile/ChangePasswordModal";
import ProfileSections from "@/app/profile/ProfileSections";
import useFetch from "@/ApiHandle/useFetch";
import { MdEdit, MdClose, MdSave } from 'react-icons/md';

const EditButton = ({ onClick }) => {
  return (
    <button
      className="px-4 py-2 flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm transition-colors duration-200"
      onClick={onClick}
    >
      <MdEdit className="w-4 h-4" />
      Edit
    </button>
  );
};

export default function ProfilePage() {
  const { data: profileInfo, loading, setData } = useFetch(`/user/me`);
  const [basicFormData, setBasicFormData] = useState({
    name: "",
    phone: "",
    place: "",
    email: "",
    img_url: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveClick = async (section) => {
    if (section) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("token")).access_token,
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          name: basicFormData.name,
          phone: basicFormData.phone,
          place: basicFormData.place,
        }),
      });
      if (res) {
        setData((prev) => ({
          ...prev,
          name: basicFormData.name,
          phone: basicFormData.phone,
          place: basicFormData.place,
        }));
      }
    }
    setEditMode(false);
  };

  useEffect(() => {
    if (profileInfo) {
      setBasicFormData({
        name: profileInfo.name || "",
        phone: profileInfo.phone || "",
        place: profileInfo.place || "",
        email: profileInfo.email || "",
        img_url: profileInfo.img_url || "",
      });
    }
  }, [profileInfo]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        {profileInfo && (
          <div className="lg:col-span-1">
            <ProfileSections
              profileDetails={{
                name: profileInfo?.name,
                role: profileInfo?.role,
                img_url: profileInfo?.img_url,
              }}
            />
          </div>
        )}
        
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                {editMode ? (
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 text-text-primary dark:text-[#000] text-sm transition-colors duration-200"
                      onClick={() => setEditMode(false)}
                    >
                      <MdClose className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-text-primary dark:text-[#000] text-sm transition-colors duration-200"
                      onClick={() => handleSaveClick("about")}
                    >
                      <MdSave className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                ) : (
                  <EditButton onClick={() => setEditMode(!editMode)} />
                )}
              </div>

              <div className="space-y-6">
                {editMode ? (
                  <>
                    {Object.entries({
                      Name: "name",
                      Phone: "phone",
                      Place: "place",
                    }).map(([label, field]) => (
                      <div key={field} className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>
                        <input
                          type="text"
                          value={basicFormData[field]}
                          onChange={(e) =>
                            setBasicFormData({ ...basicFormData, [field]: e.target.value })
                          }
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white transition-colors duration-200"
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {Object.entries({
                      Name: profileInfo?.name,
                      Email: profileInfo?.email,
                      Phone: profileInfo?.phone,
                      Place: profileInfo?.place,
                    }).map(([label, value]) => (
                      <div key={label} className="flex flex-col space-y-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
                        <span className="text-base text-gray-900 dark:text-white">{value || '-'}</span>
                        <div className="pt-2">
                          <hr className="border-gray-200 dark:border-gray-700" />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                <div className="flex flex-col space-y-2 pt-4">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Password</span>
                  <div>
                    <button
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-text-primary rounded-lg text-sm transition-colors duration-200"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}