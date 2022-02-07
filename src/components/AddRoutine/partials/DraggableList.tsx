import * as React from "react";
import DraggableListItem from "./DraggableListItem";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { RoutineExercise } from "../../../types/exercise";

export type DraggableListProps = {
  exercises: RoutineExercise[];
  onDragEnd: OnDragEndResponder;
  onDeleteExercise: (exercise: RoutineExercise) => void;
};

const DraggableList = React.memo(
  ({ exercises, onDragEnd, onDeleteExercise }: DraggableListProps) => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-list">
          {(provided: any) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {exercises.map((exercise, index) => (
                <DraggableListItem
                  exercise={exercise}
                  index={index}
                  key={exercise.name}
                  onDeleteExercise={onDeleteExercise}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
);

export default DraggableList;
