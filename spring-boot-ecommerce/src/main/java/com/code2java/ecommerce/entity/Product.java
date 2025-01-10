package com.code2java.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name="product")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;
   @ManyToOne
   @JoinColumn(name="category_id", nullable=false)
    private ProductCategory category;

    @Column(name="sku")
    private String sku;
    @Column(name="name")
    private String name;
    @Column(name="description")
    private String description;
    @Column(name="unitPrice")
    private BigDecimal unitPrice;
    @Column(name="imageUrl")
    private String imageUrl;
    @Column(name="active")
    private boolean active;
    @Column(name="unitsInStock")
    private int unitsInStock;
    @CreationTimestamp
    @Column(name="dateCreated")
    private Date dateCreated;
   
    @Column(name="lastUpdated")
    @UpdateTimestamp
    private Date lastUpdated;
}
