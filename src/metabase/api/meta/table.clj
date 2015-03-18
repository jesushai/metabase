(ns metabase.api.meta.table
  "/api/meta/table endpoints."
  (:require [compojure.core :refer [GET PUT]]
            [korma.core :refer :all]
            [medley.core :as m]
            [metabase.api.common :refer :all]
            [metabase.db :refer :all]
            (metabase.models [hydrate :refer :all]
                             [database :refer [Database]]
                             [field :refer [Field]]
                             [foreign-key :refer [ForeignKey]]
                             [table :refer [Table]])
            [metabase.util :as u]))


(defendpoint GET "/" [org]
  (require-params org)
  (let [db-ids (->> (sel :many [Database :id] :organization_id org)
                 (map :id))]
    (-> (sel :many Table :db_id [in db-ids] (order :name :ASC))
      (simple-batched-hydrate Database :db_id :db))))


(defendpoint GET "/:id" [id]
  (->404 (sel :one Table :id id)
         (hydrate :db :pk_field)))

(defendpoint PUT "/:id" [id :as {body :body}]
  (write-check Table id)
  (check-500 (->> (u/select-non-nil-keys body :entity_name :entity_type :description)
                  (m/mapply upd Table id)))
  (sel :one Table :id id))

(defendpoint GET "/:id/fields" [id]
  (sel :many Field :table_id id))

(defendpoint GET "/:id/query_metadata" [id]
  (->404 (sel :one Table :id id)
         (hydrate :db :fields)))

(defendpoint GET "/:id/fks" [id]
  (read-check Table id)
  (let-404 [field-ids (->> (sel :many :fields [Field :id] :table_id id)
                        (map :id))]
    (-> (sel :many ForeignKey :destination_id [in field-ids])
      ;; TODO - it's a little silly to hydrate both of these table objects
      (hydrate [:origin [:table]] [:destination [:table]]))))


;; TODO - GET /:id/segments
;; TODO - POST /:id/segments
;; TODO - GET /:id/sync
;; TODO - POST /:id/reorder

(define-routes)
