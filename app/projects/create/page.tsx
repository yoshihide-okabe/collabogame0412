"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button"; // ✅ UIボタン再利用
// 修正: DialogTitle をインポートに追加
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface Category {
  category_id: number;
  name: string;
}

export default function CreateProject() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    category_id: "", // ✅ 追加：カテゴリーIDを追加
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false); // ✅ モーダル表示フラグ

  useEffect(() => {
    // ユーザーIDをローカルストレージから取得
    const storedUserId = localStorage.getItem("userId");
    // 仮に未ログイン時でも確認したい場合：
    if (!storedUserId) {
      localStorage.setItem("userId", "1"); // 仮の値
      setUserId(1);
    } else {
      setUserId(parseInt(storedUserId, 10));
    }

    // 開発環境では仮のトークンを設定
    if (
      process.env.NODE_ENV === "development" &&
      !localStorage.getItem("token")
    ) {
      localStorage.setItem("token", "dummy_development_token");
    }

    // カテゴリー一覧を取得
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/projects/categories"
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        setError("カテゴリーの取得に失敗しました");
      }
    } catch (error) {
      console.error("カテゴリー取得エラー:", error);
      setError("カテゴリーの取得中にエラーが発生しました");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // 入力検証
    if (!formData.title || !formData.description || !formData.category_id) {
      setError("必須項目を入力してください");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("認証情報がありません。再ログインしてください");
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:8000/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          summary: formData.summary,
          description: formData.description,
          category_id: parseInt(formData.category_id, 10), // ✅ 追加：category_id を送信
          creator_user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "プロジェクトの登録に失敗しました");
      }

      const data = await response.json();

      // プロジェクトIDをセッションストレージに保存
      sessionStorage.setItem("currentProjectId", data.project_id.toString());

      // 成功メッセージ
      toast.success("プロジェクトが正常に作成されました");

      setShowModal(true); // ✅ 登録成功後にモーダル表示

      // プロジェクト詳細ページに遷移
      // router.push(`/projects/${data.project_id}`);
    } catch (err) {
      console.error("プロジェクト登録エラー:", err);
      setError(
        err instanceof Error
          ? err.message
          : "プロジェクトの登録中にエラーが発生しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ モーダルボタン処理
  const handleYes = () => {
    setShowModal(false);
    router.push("/troubles/create");
  };

  const handleNo = () => {
    setShowModal(false);
    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">新規プロジェクト</h1>
        <p className="text-gray-600">
          あなたのプロジェクトの詳細を入力してください
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border-l-4 border-red-600 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block font-medium text-gray-700">
            プロジェクト名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="例: 地域コミュニティアプリの開発"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="summary" className="block font-medium text-gray-700">
            プロジェクト概要
          </label>
          <input
            type="text"
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="プロジェクトの概要を簡潔に記入してください"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block font-medium text-gray-700"
          >
            プロジェクト詳細 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="プロジェクトの詳細説明をここに入力してください"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <p className="text-sm text-gray-500">
            ※プロジェクトの詳細説明やゴール、メリットなどを記載してください
          </p>
        </div>

        {/* ✅ 追加：カテゴリー選択エリア */}
        <div className="space-y-2">
          <label
            htmlFor="category_id"
            className="block font-medium text-gray-700"
          >
            カテゴリー <span className="text-red-500">*</span>
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">-- カテゴリーを選択 --</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "登録中..." : "登録する"}
          </button>
        </div>
      </form>

      {/* ✅ 成功後のモーダル */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          {/* ここに DialogTitle を追加（修正箇所） */}
          <DialogTitle>確認</DialogTitle>
          <div className="text-lg font-medium mb-4">
            続けてお困りごとを登録しますか？
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                router.push("/"); // ✅ ホームへ遷移
              }}
            >
              いいえ
            </Button>
            <Button
              onClick={() => {
                setShowModal(false);
                router.push("/troubles/create");
              }}
            >
              はい
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
