import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Calendar,
  Users,
  MapPin,
  Clock,
  FileText,
  Save,
  Search,
  ChevronDown,
  Trash2,
  List,
  Tag,
  BookOpen,
  Plus,
} from "lucide-react";

// --- INTERFACES ---

interface EventAddon {
  id: string;
  receivables: string[] | string; // Array from backend, string in local state
  requirements: string[] | string;
  tags: string[] | string;
}

interface EventAgenda {
  id: string;
  startTime: string;
  endTime: string;
  agendaTitle: string;
  agendaDescription: string;
}

interface EventResourcePerson {
  id: string;
  name: string;
  designation: string;
  about: string;
  profileImg: string;
}

interface Event {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  description?: string;
  startDateTime: string;
  endDateTime?: string;
  venue?: string;
  eventOrganizerId?: string;
  maxParticipants?: number;
  registrations?: { id: string }[];
  addons?: EventAddon[];
  agenda?: EventAgenda[];
  resourcePersons?: EventResourcePerson[];
}

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateEvent: (eventData: any) => void;
  event: Event | null;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// --- UTILITY FUNCTIONS ---

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDateTimeForInput = (date: Date | string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const stringToArray = (s: string | string[]): string[] => {
  if (Array.isArray(s)) return s;
  if (!s) return [];
  return s
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

// --- HELPER COMPONENTS (MOVED OUTSIDE) ---

const SectionIcon = ({ icon: Icon, colorClass, title }: any) => (
  <div className="flex items-center space-x-3">
    <div
      className={`w-8 h-8 ${colorClass} rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300`}
    >
      <Icon className="w-4 h-4 text-white" />
    </div>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <div className={`h-px bg-gradient-to-r ${colorClass} flex-1 opacity-30`} />
  </div>
);

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  Icon,
  required = false,
  min,
  rows,
  focusColor = "ring-blue-500",
  ...props
}: any) => (
  <div className="space-y-1">
    <label className="block text-sm font-bold text-gray-700">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows || 3}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}/20 focus:border-${
            focusColor.split("-")[1]
          } transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 text-sm resize-none`}
          placeholder={placeholder}
          required={required}
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          required={required}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor}/20 focus:border-${
            focusColor.split("-")[1]
          } transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 text-sm`}
          placeholder={placeholder}
          {...props}
        />
      )}
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  onUpdateEvent,
  event,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "other",
    description: "",
    startDateTime: "",
    endDateTime: "",
    venue: "",
    eventOrganizerId: "",
    maxParticipants: "",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState<User | null>(null);
  const [isOrganizerDropdownOpen, setIsOrganizerDropdownOpen] = useState(false);
  const [organizerSearch, setOrganizerSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState("");

  const [addons, setAddons] = useState<EventAddon[]>([]);
  const [agenda, setAgenda] = useState<EventAgenda[]>([]);
  const [resourcePersons, setResourcePersons] = useState<EventResourcePerson[]>(
    [],
  );

  const [isAddonsOpen, setIsAddonsOpen] = useState(true);
  const [isAgendaOpen, setIsAgendaOpen] = useState(true);
  const [isResourcePersonsOpen, setIsResourcePersonsOpen] = useState(true);

  const eventCategories = [
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "competition", label: "Competition" },
    { value: "social", label: "Social" },
    { value: "fundraising", label: "Fundraising" },
    { value: "meeting", label: "Meeting" },
    { value: "conference", label: "Conference" },
    { value: "other", label: "Other" },
  ];

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoadingUsers(true);
      const response = await fetch("/api/users/select");

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (event && isOpen) {
      const startDateTime = new Date(event.startDateTime);
      const endDateTime = event.endDateTime
        ? new Date(event.endDateTime)
        : null;

      setFormData({
        title: event.title,
        subtitle: event.subtitle || "",
        category: event.category,
        description: event.description || "",
        startDateTime: formatDateTimeForInput(startDateTime),
        endDateTime: endDateTime ? formatDateTimeForInput(endDateTime) : "",
        venue: event.venue || "",
        eventOrganizerId: event.eventOrganizerId || "",
        maxParticipants: event.maxParticipants
          ? event.maxParticipants.toString()
          : "",
      });

      setAddons(
        (event.addons || []).map((addon) => ({
          ...addon,
          receivables: Array.isArray(addon.receivables)
            ? addon.receivables.join(", ")
            : addon.receivables,
          requirements: Array.isArray(addon.requirements)
            ? addon.requirements.join(", ")
            : addon.requirements,
          tags: Array.isArray(addon.tags) ? addon.tags.join(", ") : addon.tags,
        })),
      );

      setAgenda(
        (event.agenda || []).map((item) => ({
          ...item,
          startTime: formatDateTimeForInput(item.startTime),
          endTime: formatDateTimeForInput(item.endTime),
        })),
      );

      setResourcePersons(event.resourcePersons || []);

      fetchUsers();
    }
  }, [event, isOpen, fetchUsers]);

  useEffect(() => {
    if (event && event.eventOrganizerId && users.length > 0) {
      const organizer = users.find(
        (user) => user.id === event.eventOrganizerId,
      );
      if (organizer) {
        setSelectedOrganizer(organizer);
        setOrganizerSearch(`${organizer.firstName} ${organizer.lastName}`);
      }
    }
  }, [users, event]);

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(organizerSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(organizerSearch.toLowerCase()),
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "startDateTime" && value && formData.endDateTime) {
      const startDate = new Date(value);
      const endDate = new Date(formData.endDateTime);
      if (endDate < startDate) {
        setFormData((prev) => ({
          ...prev,
          endDateTime: value,
        }));
      }
    }
  };

  const handleOrganizerSelect = (user: User) => {
    setSelectedOrganizer(user);
    setFormData((prev) => ({
      ...prev,
      eventOrganizerId: user.id,
    }));
    setOrganizerSearch(`${user.firstName} ${user.lastName}`);
    setIsOrganizerDropdownOpen(false);
  };

  const addAddon = () => {
    setAddons((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        receivables: "",
        requirements: "",
        tags: "",
      },
    ]);
  };

  const updateAddon = (id: string, field: keyof EventAddon, value: string) => {
    setAddons((prev) =>
      prev.map((addon) =>
        addon.id === id ? { ...addon, [field]: value } : addon,
      ),
    );
  };

  const removeAddon = (id: string) => {
    setAddons((prev) => prev.filter((addon) => addon.id !== id));
  };

  const addAgendaItem = () => {
    setAgenda((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        startTime: "",
        endTime: "",
        agendaTitle: "",
        agendaDescription: "",
      },
    ]);
  };

  const updateAgendaItem = (
    id: string,
    field: keyof EventAgenda,
    value: string,
  ) => {
    setAgenda((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const removeAgendaItem = (id: string) => {
    setAgenda((prev) => prev.filter((item) => item.id !== id));
  };

  const addResourcePerson = () => {
    setResourcePersons((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        name: "",
        designation: "",
        about: "",
        profileImg: "",
      },
    ]);
  };

  const updateResourcePerson = (
    id: string,
    field: keyof EventResourcePerson,
    value: string,
  ) => {
    setResourcePersons((prev) =>
      prev.map((person) =>
        person.id === id ? { ...person, [field]: value } : person,
      ),
    );
  };

  const removeResourcePerson = (id: string) => {
    setResourcePersons((prev) => prev.filter((person) => person.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setIsLoading(true);
    setError("");

    try {
      if (formData.endDateTime && formData.startDateTime) {
        const startDate = new Date(formData.startDateTime);
        const endDate = new Date(formData.endDateTime);
        if (endDate < startDate) {
          setError("End date cannot be before start date");
          setIsLoading(false);
          return;
        }
      }

      const preparedAddons = addons.map((addon) => ({
        id: addon.id.startsWith("temp-") ? undefined : addon.id,
        receivables: stringToArray(addon.receivables),
        requirements: stringToArray(addon.requirements),
        tags: stringToArray(addon.tags),
      }));

      const preparedAgenda = agenda.map((item) => ({
        id: item.id.startsWith("temp-") ? undefined : item.id,
        startTime: item.startTime,
        endTime: item.endTime,
        agendaTitle: item.agendaTitle,
        agendaDescription: item.agendaDescription,
      }));

      const preparedResourcePersons = resourcePersons.map((person) => ({
        id: person.id.startsWith("temp-") ? undefined : person.id,
        name: person.name,
        designation: person.designation,
        about: person.about,
        profileImg: person.profileImg,
      }));

      const eventData = {
        ...formData,
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : null,
        addons: preparedAddons,
        agenda: preparedAgenda,
        resourcePersons: preparedResourcePersons,
      };

      const response = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update event");
      }

      const result = await response.json();
      onUpdateEvent(result.event);

      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while updating the event");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border-2 border-gray-100 transform transition-all duration-300 animate-scale-in">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/90 to-red-50/90 backdrop-blur-sm" />

          <div className="relative flex justify-between items-center p-5">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-7 h-7 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span>Edit Event: {event.title}</span>
              </h2>
              <p className="text-gray-700 font-medium ml-10 text-sm">
                Update event details and related entities.
              </p>
            </div>
            <button
              onClick={onClose}
              className="group p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors duration-300" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(95vh-140px)] bg-gradient-to-br from-gray-50/50 to-white"
        >
          <div className="p-5 space-y-6">
            {error && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-l-4 border-red-500 shadow-lg animate-slide-in">
                <p className="text-red-800 font-semibold text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <SectionIcon
                icon={FileText}
                title="Basic Details"
                colorClass="from-orange-500 to-red-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <InputField
                      label="Event Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Annual General Meeting"
                      focusColor="ring-orange-500"
                    />
                  </div>
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <InputField
                      label="Event Subtitle"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      placeholder="Celebrating 10 years of service"
                      focusColor="ring-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white text-gray-900 text-sm"
                    >
                      {eventCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Event Organizer
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={organizerSearch}
                        onChange={(e) => {
                          setOrganizerSearch(e.target.value);
                          setIsOrganizerDropdownOpen(true);
                        }}
                        onFocus={() => setIsOrganizerDropdownOpen(true)}
                        onBlur={() =>
                          setTimeout(
                            () => setIsOrganizerDropdownOpen(false),
                            200,
                          )
                        }
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 text-sm"
                        placeholder="Search for an organizer..."
                      />

                      {isOrganizerDropdownOpen && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto animate-fade-in">
                          {isLoadingUsers ? (
                            <div className="p-3 text-center text-gray-500 text-xs">
                              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                              Loading Users
                            </div>
                          ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <button
                                key={user.id}
                                type="button"
                                onMouseDown={() => handleOrganizerSelect(user)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                              >
                                <div className="font-medium text-gray-900 text-sm">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {user.email}
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-3 text-center text-gray-500 text-sm">
                              No users found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <InputField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  type="textarea"
                  rows={3}
                  placeholder="Describe the event's purpose, agenda highlights, and target audience..."
                  focusColor="ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-5">
              <SectionIcon
                icon={Clock}
                title="Schedule & Capacity"
                colorClass="from-orange-500 to-red-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <InputField
                      label="Start Date & Time"
                      name="startDateTime"
                      value={formData.startDateTime}
                      onChange={handleInputChange}
                      type="datetime-local"
                      required
                      min={getCurrentDateTime()}
                      focusColor="ring-orange-500"
                    />
                  </div>

                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <InputField
                      label="End Date & Time"
                      name="endDateTime"
                      value={formData.endDateTime}
                      onChange={handleInputChange}
                      type="datetime-local"
                      min={formData.startDateTime || getCurrentDateTime()}
                      focusColor="ring-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <InputField
                      label="Venue"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      placeholder="Room A, Zoom Link, University Auditorium"
                      focusColor="ring-orange-500"
                    />
                  </div>

                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <InputField
                      label="Max Participants (Optional)"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      type="number"
                      min="1"
                      placeholder="e.g., 100 or leave blank for unlimited"
                      focusColor="ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <SectionIcon
                icon={Users}
                title="Additional Event Details"
                colorClass="from-orange-500 to-red-500"
              />

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-100 p-3 rounded-xl border border-gray-200">
                  <div
                    onClick={() => setIsAddonsOpen(!isAddonsOpen)}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Tag className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-bold text-gray-800">
                      Event Addons ({addons.length})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={addAddon}
                      className="group flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-medium hover:scale-105 text-xs"
                    >
                      <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                      <span>Add</span>
                    </button>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                        isAddonsOpen ? "rotate-180" : "rotate-0"
                      }`}
                      onClick={() => setIsAddonsOpen(!isAddonsOpen)}
                    />
                  </div>
                </div>

                {isAddonsOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    {addons.map((addon, index) => (
                      <div
                        key={addon.id}
                        className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="absolute top-2 right-2 w-2 h-2 bg-orange-200 rounded-full opacity-50" />
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-800 text-sm flex items-center space-x-2">
                            <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </span>
                            <span>Addon Details</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAddon(addon.id)}
                            className="group p-1 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-300 hover:scale-110"
                          >
                            <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <InputField
                            label="Receivables (Comma separated)"
                            value={addon.receivables as string}
                            onChange={(e: any) =>
                              updateAddon(
                                addon.id,
                                "receivables",
                                e.target.value,
                              )
                            }
                            placeholder="T-Shirt, Lunch, Certificate"
                            focusColor="ring-orange-500"
                            rows={1}
                            type="textarea"
                          />
                          <InputField
                            label="Requirements (Comma separated)"
                            value={addon.requirements as string}
                            onChange={(e: any) =>
                              updateAddon(
                                addon.id,
                                "requirements",
                                e.target.value,
                              )
                            }
                            placeholder="Payment Proof, Student ID, Laptop"
                            focusColor="ring-orange-500"
                            rows={1}
                            type="textarea"
                          />
                          <InputField
                            label="Tags (Comma separated)"
                            value={addon.tags as string}
                            onChange={(e: any) =>
                              updateAddon(addon.id, "tags", e.target.value)
                            }
                            placeholder="Tech, Free, Beginner"
                            focusColor="ring-orange-500"
                            rows={1}
                            type="textarea"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-100 p-3 rounded-xl border border-gray-200">
                  <div
                    onClick={() => setIsAgendaOpen(!isAgendaOpen)}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <List className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-bold text-gray-800">
                      Event Agenda ({agenda.length})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={addAgendaItem}
                      className="group flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-medium hover:scale-105 text-xs"
                    >
                      <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                      <span>Add</span>
                    </button>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                        isAgendaOpen ? "rotate-180" : "rotate-0"
                      }`}
                      onClick={() => setIsAgendaOpen(!isAgendaOpen)}
                    />
                  </div>
                </div>

                {isAgendaOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    {agenda.map((item, index) => (
                      <div
                        key={item.id}
                        className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="absolute top-2 right-2 w-2 h-2 bg-orange-200 rounded-full opacity-50" />
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-800 text-sm flex items-center space-x-2">
                            <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </span>
                            <span>Agenda Item</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAgendaItem(item.id)}
                            className="group p-1 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-300 hover:scale-110"
                          >
                            <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <InputField
                            label="Title"
                            value={item.agendaTitle}
                            onChange={(e: any) =>
                              updateAgendaItem(
                                item.id,
                                "agendaTitle",
                                e.target.value,
                              )
                            }
                            placeholder="Keynote Speech"
                            focusColor="ring-orange-500"
                            required
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <InputField
                              label="Start Time"
                              value={item.startTime}
                              onChange={(e: any) =>
                                updateAgendaItem(
                                  item.id,
                                  "startTime",
                                  e.target.value,
                                )
                              }
                              type="datetime-local"
                              focusColor="ring-orange-500"
                              required
                            />
                            <InputField
                              label="End Time"
                              value={item.endTime}
                              onChange={(e: any) =>
                                updateAgendaItem(
                                  item.id,
                                  "endTime",
                                  e.target.value,
                                )
                              }
                              type="datetime-local"
                              focusColor="ring-orange-500"
                              required
                            />
                          </div>
                          <InputField
                            label="Description (Optional)"
                            value={item.agendaDescription}
                            onChange={(e: any) =>
                              updateAgendaItem(
                                item.id,
                                "agendaDescription",
                                e.target.value,
                              )
                            }
                            type="textarea"
                            rows={2}
                            placeholder="Detailed description of the session."
                            focusColor="ring-orange-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-100 p-3 rounded-xl border border-gray-200">
                  <div
                    onClick={() =>
                      setIsResourcePersonsOpen(!isResourcePersonsOpen)
                    }
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-bold text-gray-800">
                      Resource Persons ({resourcePersons.length})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={addResourcePerson}
                      className="group flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-medium hover:scale-105 text-xs"
                    >
                      <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                      <span>Add</span>
                    </button>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                        isResourcePersonsOpen ? "rotate-180" : "rotate-0"
                      }`}
                      onClick={() =>
                        setIsResourcePersonsOpen(!isResourcePersonsOpen)
                      }
                    />
                  </div>
                </div>

                {isResourcePersonsOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    {resourcePersons.map((person, index) => (
                      <div
                        key={person.id}
                        className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="absolute top-2 right-2 w-2 h-2 bg-orange-200 rounded-full opacity-50" />
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-800 text-sm flex items-center space-x-2">
                            <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </span>
                            <span>Resource Person</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeResourcePerson(person.id)}
                            className="group p-1 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-300 hover:scale-110"
                          >
                            <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <InputField
                            label="Full Name"
                            value={person.name}
                            onChange={(e: any) =>
                              updateResourcePerson(
                                person.id,
                                "name",
                                e.target.value,
                              )
                            }
                            placeholder="Jane Doe"
                            focusColor="ring-orange-500"
                            required
                          />
                          <InputField
                            label="Designation (Optional)"
                            value={person.designation}
                            onChange={(e: any) =>
                              updateResourcePerson(
                                person.id,
                                "designation",
                                e.target.value,
                              )
                            }
                            placeholder="CEO, Professor of AI"
                            focusColor="ring-orange-500"
                          />
                          <InputField
                            label="About (Optional)"
                            value={person.about}
                            onChange={(e: any) =>
                              updateResourcePerson(
                                person.id,
                                "about",
                                e.target.value,
                              )
                            }
                            type="textarea"
                            rows={2}
                            placeholder="Brief biography."
                            focusColor="ring-orange-500"
                          />
                          <InputField
                            label="Profile Image URL (Optional)"
                            value={person.profileImg}
                            onChange={(e: any) =>
                              updateResourcePerson(
                                person.id,
                                "profileImg",
                                e.target.value,
                              )
                            }
                            type="url"
                            placeholder="https://example.com/profile.jpg"
                            focusColor="ring-orange-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden border-t border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-orange-50/30" />
            <div className="relative flex justify-end p-5">
              <button
                type="button"
                onClick={onClose}
                className="group px-5 py-2 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 font-semibold hover:scale-105 transform text-sm mr-3"
                disabled={isLoading}
              >
                <span className="group-hover:scale-105 transition-transform duration-300">
                  Cancel
                </span>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="group flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 transform font-semibold text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Updating</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Update Event</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes slide-in {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }

          .animate-scale-in {
            animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .animate-slide-in {
            animation: slide-in 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default EditEventModal;
