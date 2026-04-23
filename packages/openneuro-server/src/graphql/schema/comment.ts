import { CommentRef, UserRef } from "./refs"
import CommentFields from "../resolvers/comment"

CommentRef.implement({
  fields: (t) => ({
    id: t.id({
      nullable: false,
      resolve: (obj) => obj._id ?? obj.id,
    }),
    text: t.string({ nullable: false, resolve: (obj) => obj.text }),
    user: t.field({
      type: UserRef,
      resolve: (obj) => CommentFields.user(obj),
    }),
    createDate: t.field({
      type: "DateTime",
      nullable: false,
      resolve: (obj) => obj.createDate,
    }),
    parent: t.field({
      type: CommentRef,
      resolve: (obj) => CommentFields.parent(obj),
    }),
    replies: t.field({
      type: [CommentRef],
      nullable: { list: true, items: true },
      resolve: (obj) => CommentFields.replies(obj),
    }),
  }),
})
