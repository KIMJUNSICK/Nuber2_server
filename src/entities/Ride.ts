import { rideStatus } from "src/types/types";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import User from "./User";

@Entity()
class Ride extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    type: "text",
    enum: ["REQUESTING", "ACCEPTED", "ONROUTE", "FINISHED", "CANCELED"]
  })
  status: rideStatus;

  @Column({ type: "text" })
  pickUpAddress: string;

  @Column({ type: "double precision", default: false })
  pickUpLat: number;

  @Column({ type: "double precision", default: false })
  pickUpLng: number;

  @Column({ type: "text" })
  dropOffAddress: string;

  @Column({ type: "double precision", default: false })
  dropOffLat: number;

  @Column({ type: "double precision", default: false })
  dropOffLng: number;

  @Column({ type: "double precision", default: false })
  price: number;

  @Column({ type: "text" })
  distance: string;

  @Column({ type: "text" })
  duration: string;

  @ManyToOne(type => User, user => user.rideAsDriver)
  driver: User;

  @ManyToOne(type => User, user => user.rideAsPassenger)
  passenger: User;

  @CreateDateColumn() createdAt: string;
  @UpdateDateColumn() updatedAt: string;
}

export default Ride;
