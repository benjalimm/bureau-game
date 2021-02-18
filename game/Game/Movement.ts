import Game from '../Game';
import { Mesh } from 'three'
import { Position, UserMovement } from '../../models/Game';

export function moveMesh(game: Game, props: {
  mesh: Mesh,
  movement: Position,
}) {
  const { mesh, movement } = props
  mesh.position.x += movement.x;
  mesh.position.y += movement.y;
  mesh.position.z += movement.z;
}

export function moveUser(game: Game, props: {
  userMovement: UserMovement,
  uid: string
}) {
  const { userMovement } = props;

}