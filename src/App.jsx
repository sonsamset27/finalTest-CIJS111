import React, { useState, useEffect } from "react";
import { Input, Button, message, Empty } from "antd";
import TaskCard from "./components/TaskCard";

const App = () => {
  // Tải danh sách công việc từ localStorage hoặc khởi tạo mảng rỗng nếu trống
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing todos from localStorage", e);
      }
    }
    return [];
  });

  const [currentTab, setCurrentTab] = useState("All");
  const [inputValue, setInputValue] = useState("");

  // Đồng bộ danh sách công việc vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(tasks));
  }, [tasks]);

  // Xử lý thêm công việc mới
  const handleAddTask = (e) => {
    if (e) e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      message.warning("Please enter task details");
      return;
    }
    const newTask = {
      id: Date.now(),
      description: trimmedValue,
      active: true
    };
    setTasks([...tasks, newTask]);
    setInputValue("");
    message.success("Task added successfully");
  };

  // Chuyển đổi trạng thái hoàn thành (active) của công việc
  const handleToggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, active: !task.active } : task
      )
    );
  };

  // Xóa một công việc cụ thể (chỉ hiển thị/khả dụng đối với công việc đã hoàn thành)
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    message.success("Task deleted");
  };

  // Xóa toàn bộ công việc đã hoàn thành
  const handleDeleteAllCompleted = () => {
    const completedCount = tasks.filter((task) => !task.active).length;
    if (completedCount === 0) {
      message.info("No completed tasks to delete");
      return;
    }
    setTasks(tasks.filter((task) => task.active));
    message.success(`Deleted ${completedCount} completed task(s)`);
  };

  // Lọc danh sách công việc dựa trên tab đang chọn
  const filteredTasks = tasks.filter((task) => {
    if (currentTab === "Active") return task.active;
    if (currentTab === "Completed") return !task.active;
    return true; // "All"
  });

  const tabs = ["All", "Active", "Completed"];

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      {/* Tiêu đề */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 select-none tracking-tight">
        #todo
      </h1>

      {/* Menu chuyển Tab */}
      <div className="flex border-b border-gray-200 mb-6 relative">
        {tabs.map((tab) => {
          const isActive = currentTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`pb-3 font-semibold text-sm transition-all duration-300 relative px-4 flex-1 cursor-pointer outline-none ${isActive ? "text-gray-900 font-bold" : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {tab}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[3px] bg-blue-500 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Form thêm công việc - Chỉ hiển thị tại tab "All" và "Active" */}
      {(currentTab === "All" || currentTab === "Active") && (
        <form onSubmit={handleAddTask} className="flex gap-3 mb-6">
          <Input
            placeholder="add details"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 rounded-xl h-11 border border-gray-200 px-4 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium"
          />
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 hover:bg-blue-600 border-none font-semibold px-8 rounded-xl h-11 text-white shadow-sm cursor-pointer transition-all duration-200"
          >
            Add
          </Button>
        </form>
      )}

      {/* Danh sách công việc */}
      <div className="space-y-1 mb-8">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              showDelete={currentTab === "Completed"}
            />
          ))
        ) : (
          <Empty
            description={
              <span className="text-gray-400 font-medium text-sm">
                Danh sách {currentTab === "All" ? "tất cả" : currentTab === "Active" ? "đang thực hiện" : "đã hoàn thành"} trống
              </span>
            }
            className="py-8"
          />
        )}
      </div>

      {/* Nút Xóa tất cả - Chỉ hiển thị tại tab "Completed" */}
      {currentTab === "Completed" && filteredTasks.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleDeleteAllCompleted}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs px-5 py-3 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 active:scale-95 outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            delete all
          </button>
        </div>
      )}
    </div>
  );
};

export default App;